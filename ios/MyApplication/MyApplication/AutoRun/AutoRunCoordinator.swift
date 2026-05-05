//
//  AutoRunCoordinator.swift
//  MyApplication
//
//  评测工具自动运行协调器：根据环境变量选择并执行对应的 auto-run flow。
//

import Foundation

enum AutoRunError: Error {
    case unknownFlow(String)
    case timeout
}

class AutoRunCoordinator {

    private static let flows: [String: () -> AutoRunFlow] = [
        "anchor_start_then_end": { AnchorStartThenEnd() }
    ]

    /// 从环境变量 `EVAL_AUTO_RUN_FLOW` 读取 flow ID 并执行。
    /// 若未设置则跳过（手动模式）。
    static func runIfNeeded(completion: @escaping (Result<Void, Error>) -> Void) {
        guard let flowId = ProcessInfo.processInfo.environment["EVAL_AUTO_RUN_FLOW"],
              !flowId.isEmpty else {
            // 手动模式，不执行自动流程
            completion(.success(()))
            return
        }

        guard let factory = flows[flowId] else {
            completion(.failure(AutoRunError.unknownFlow(flowId)))
            return
        }

        let flow = factory()
        let timeoutSec: TimeInterval = 60

        // 全局超时保护
        var didComplete = false
        DispatchQueue.global().asyncAfter(deadline: .now() + timeoutSec) {
            if !didComplete {
                didComplete = true
                completion(.failure(AutoRunError.timeout))
            }
        }

        flow.run { result in
            guard !didComplete else { return }
            didComplete = true
            NSLog("[MyApplication] auto-run flow done: %@", flowId)
            completion(result)
        }
    }
}
