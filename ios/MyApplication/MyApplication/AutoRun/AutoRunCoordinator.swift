//
//  AutoRunCoordinator.swift
//  MyApplication
//
//  Auto-run flow dispatcher: selects and executes the flow specified by environment variable.
//

import Foundation

enum AutoRunError: Error {
    case unknownFlow(String)
    case timeout
}

class AutoRunCoordinator {
    private static let flows: [String: () -> AutoRunFlow] = [
        // Generic flow — works for ANY injected code scenario
        "run_generated": { RunGenerated() },
        // Legacy flow — kept for backward compatibility with existing Live/anchor cases
        "anchor_start_then_end": { AnchorStartThenEnd() },
    ]

    /// Read flow ID from `EVAL_AUTO_RUN_FLOW` env var and execute.
    /// If not set, skip (manual mode).
    /// If flow ID is unknown, gracefully fall back to "run_generated".
    static func runIfNeeded(completion: @escaping (Result<Void, Error>) -> Void) {
        guard let flowId = ProcessInfo.processInfo.environment["EVAL_AUTO_RUN_FLOW"],
              !flowId.isEmpty
        else {
            // Manual mode
            completion(.success(()))
            return
        }

        let factory: () -> AutoRunFlow
        if let f = flows[flowId] {
            factory = f
        } else {
            // Graceful fallback: unknown flow → use run_generated
            NSLog("[AutoRunCoordinator] Unknown flow: '%@'. Known: %@. Falling back to 'run_generated'.",
                  flowId, Array(flows.keys).joined(separator: ", "))
            factory = flows["run_generated"]!
        }

        let flow = factory()
        let timeoutSec: TimeInterval = 60

        // Global timeout protection
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
