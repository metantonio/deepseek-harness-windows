// dsh-undici-fix.mjs — raise undici's streaming timeout defaults for this process
const MAX_MS = 2_147_483_647 // 2**31-1 ms ≈ 24.85 days = Node's safe max for timers

async function loadUndici() {
  try { const m = await import('undici'); if (m.Agent) return m } catch { }
  const cands = [
    'C:/Users/anton/.dsh/profiles/node_modules/undici/index.js'
  ]
  for (const p of cands) {
    try { const m = await import(new URL(`file://${p}`).href); if (m.Agent) return m } catch { }
  }
  throw new Error('dsh-undici-fix: cannot resolve undici')
}

const undici = await loadUndici()

// PARCHE EN EL PROTOTIPO (Evita el error 'read only property' de ESM)
if (undici.Agent && !undici.Agent.prototype[Symbol.for('dsh.undiciFix')]) {
  // Modificamos el prototipo de la clase base Dispatcher / Agent que lee las opciones
  const originalConfigure = undici.Agent.prototype.configure;
  if (originalConfigure) {
    undici.Agent.prototype.configure = function (options) {
      if (options) {
        options.bodyTimeout = MAX_MS;
        options.headersTimeout = MAX_MS;
      }
      return originalConfigure.call(this, options);
    };
  } else {
    // Si no tiene .configure, interceptamos la inicialización del Pool/Client interno
    // forzando las propiedades directamente en las instancias de Agent
    const originalDispatch = undici.Agent.prototype.dispatch;
    if (originalDispatch) {
      undici.Agent.prototype.dispatch = function (opts, handler) {
        if (this.options) {
          this.options.bodyTimeout = MAX_MS;
          this.options.headersTimeout = MAX_MS;
        }
        return originalDispatch.call(this, opts, handler);
      };
    }
  }

  undici.Agent.prototype[Symbol.for('dsh.undiciFix')] = true;
  console.error(`[dsh-undici-fix] Parche aplicado en el prototipo de undici.Agent (${MAX_MS}ms).`);
}
