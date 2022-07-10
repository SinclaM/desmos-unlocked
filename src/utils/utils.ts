interface FuncAny {
  (): any;
}

export async function pollForValue(func: FuncAny) {
  return await _pollForValue(func);
}

function _pollForValue<T>(func: () => T) {
  return new Promise<T>((resolve) => {
    const interval = setInterval(() => {
      const val = func();
      if (val !== null && val !== undefined) {
        clearInterval(interval);
        resolve(val);
      }
    }, 50);
  });
}

