//
//  Env.swift
//  MyApplication
//
//  严格读取并校验环境变量。命中缺失立即抛错，不静默 fallback —— 这是评测工具反作弊的硬约束。
//

import Foundation

struct TrtcTestEnv {
    let sdkAppId: Int
    let userId: String
    let userSig: String
    let autoRunFlow: String?
}

enum EnvError: Error, CustomStringConvertible {
    case missing(String)
    case invalid(String, String)

    var description: String {
        switch self {
        case .missing(let key):
            return "Missing required env: \(key). Set it via Xcode scheme or launch arguments."
        case .invalid(let key, let value):
            return "\(key) must be a positive integer, got: \(value)"
        }
    }
}

func loadEnv() throws -> TrtcTestEnv {
    let env = ProcessInfo.processInfo.environment

    guard let sdkAppIdRaw = env["TRTC_TEST_SDKAPPID"], !sdkAppIdRaw.isEmpty else {
        throw EnvError.missing("TRTC_TEST_SDKAPPID")
    }
    guard let sdkAppId = Int(sdkAppIdRaw), sdkAppId > 0 else {
        throw EnvError.invalid("TRTC_TEST_SDKAPPID", sdkAppIdRaw)
    }
    guard let userId = env["TRTC_TEST_USERID"], !userId.isEmpty else {
        throw EnvError.missing("TRTC_TEST_USERID")
    }
    guard let userSig = env["TRTC_TEST_USERSIG"], !userSig.isEmpty else {
        throw EnvError.missing("TRTC_TEST_USERSIG")
    }

    let autoRunFlow = env["EVAL_AUTO_RUN_FLOW"]

    return TrtcTestEnv(
        sdkAppId: sdkAppId,
        userId: userId,
        userSig: userSig,
        autoRunFlow: (autoRunFlow?.isEmpty ?? true) ? nil : autoRunFlow
    )
}
