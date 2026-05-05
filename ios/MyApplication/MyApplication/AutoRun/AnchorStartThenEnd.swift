//
//  AnchorStartThenEnd.swift
//  MyApplication
//
//  占位实现：未注入 AI 代码时仍能跑完（直接结束）。
//  AI 代码会通过 Generated/GeneratedView.swift 注入，由本 flow 调用。
//

import Foundation

class AnchorStartThenEnd: AutoRunFlow {

    func run(completion: @escaping (Result<Void, Error>) -> Void) {
        NSLog("[anchor_start_then_end] flow start")

        // 动态检查注入点是否提供了具体实现
        let viewClass: AnyClass? = NSClassFromString("MyApplication.GeneratedView")
        if let cls = viewClass {
            NSLog("[anchor_start_then_end] GeneratedView class found: %@", String(describing: cls))
        } else {
            NSLog("[anchor_start_then_end] GeneratedView not specialized; skipping")
        }

        // 模拟开播 30s 后结束；真实场景由 Generated 代码内部自行控制时序。
        DispatchQueue.global().asyncAfter(deadline: .now() + 30.0) {
            NSLog("[anchor_start_then_end] flow end")
            completion(.success(()))
        }
    }
}
