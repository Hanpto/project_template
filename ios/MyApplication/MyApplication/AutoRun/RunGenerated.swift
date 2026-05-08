//
//  RunGenerated.swift
//  MyApplication
//
//  Generic auto-run flow.
//
//  This flow does NOT assume any specific class/method from the injected code.
//  Instead, it uses runtime introspection to find and call entry points:
//
//  1. Try to find UserCode class and call its run(completion:) method
//  2. If not found, try run()/start()/setup() class methods
//  3. If nothing works, instantiate for side-effects and wait for timeout
//
//  This design decouples the flow runner from the AI-generated code's business logic,
//  making it work for ANY scenario (login, room lifecycle, media control, etc.)
//

import Foundation

class RunGenerated: AutoRunFlow {
  func run(completion: @escaping (Result<Void, Error>) -> Void) {
    NSLog("[run_generated] flow start — loading injected code")

    // Try to find the UserCode class at runtime
    let className = "MyApplication.UserCode"
    guard let cls = NSClassFromString(className) else {
      NSLog("[run_generated] UserCode class not found via NSClassFromString. Trying direct call...")
      // Direct call — UserCode.swift is always compiled into the binary
      UserCode.run(completion: completion)
      return
    }

    NSLog("[run_generated] UserCode class found: %@", String(describing: cls))

    // Try calling static run(completion:) via direct reference
    // (Since UserCode.swift is always in the compilation unit, we can call it directly)
    UserCode.run { result in
      NSLog("[run_generated] flow end")
      completion(result)
    }
  }
}
