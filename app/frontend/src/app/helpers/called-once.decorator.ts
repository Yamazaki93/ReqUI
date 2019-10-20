// Enforces a function inside a class is only called once

export function CalledOnce(target, key, descriptor) {

    // save a reference to the original method this way we keep the values currently in the
    // descriptor and don't overwrite what another decorator might have done to the descriptor.
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    const originalMethod = descriptor.value;

    // editing the descriptor/value parameter
    descriptor.value = function() {
        if (this.__methodsCalled && this.__methodsCalled[key]) {
            return;
        }
        const args = [];
        // tslint:disable-next-line:variable-name
        for (let _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        // note usage of originalMethod here
        const result = originalMethod.apply(this, args);
        if (!this.__methodsCalled) {
            this.__methodsCalled = {};
        }
        this.__methodsCalled[key] = true;
        return result;
    };

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
}

