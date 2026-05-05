//
//  AutoRunFlow.swift
//  MyApplication
//
//  自动运行流程协议。
//

import Foundation

protocol AutoRunFlow {
    func run(completion: @escaping (Result<Void, Error>) -> Void)
}
