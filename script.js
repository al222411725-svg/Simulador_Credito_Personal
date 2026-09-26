document.getElementById('btn-calcular').addEventListener('click', procesarSimulacion);

// función que registra y valida el nombre del solicitante
function registrarNombre() {
  const nombre = document.getElementById('nombre').value.trim();
  const errorMsg = document.getElementById('error-msg');

  if (nombre === '') {
    errorMsg.textContent = "Ingrese el nombre del solicitante para continuar.";
    errorMsg.style.display = 'block';
    return null;
  }

  errorMsg.style.display = 'none';
  // Muestra el saludo personalizado en pantalla
  document.getElementById('saludo').textContent = `Simulación generada para: ${nombre}`;
  return nombre;
}

function procesarSimulacion() {
  // Se registra el nombre antes de calcular ,si no es válido se detiene el proceso
  const nombreSolicitante = registrarNombre();
  if (nombreSolicitante === null) {
    return;
  }

  const montoInput = parseFloat(document.getElementById('monto').value);
  const tasaAnualInput = parseFloat(document.getElementById('tasa').value) / 100;
  const plazoMeses = parseInt(document.getElementById('plazo').value);
  const IVA_VALOR = 0.16;
  const errorMsg = document.getElementById('error-msg');

  if (isNaN(montoInput) || isNaN(tasaAnualInput) || montoInput <= 0) {
    errorMsg.textContent = "Ingrese parámetros numéricos válidos e intente nuevamente.";
    errorMsg.style.display = 'block';
    return;
  }
  errorMsg.style.display = 'none';

  const amortizacionCapital = montoInput / plazoMeses;
  const tasaMensualEquivalente = tasaAnualInput / 12;

  let saldoInsoluto = montoInput;
  const tablaBody = document.querySelector('#tabla-amortizacion tbody');
  tablaBody.innerHTML = '';
  let acumuladoPagos = 0;

  for (let periodo = 1; periodo <= plazoMeses; periodo++) {
    const interesDelPeriodo = saldoInsoluto * tasaMensualEquivalente;
    const ivaSobreInteres = interesDelPeriodo * IVA_VALOR;
    const pagoMensualTotal = amortizacionCapital + interesDelPeriodo + ivaSobreInteres;
    const saldoFinalPeriodo = Math.max(0, saldoInsoluto - amortizacionCapital);

    acumuladoPagos += pagoMensualTotal;

    // Crear fila para la tabla de amortización
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${periodo}</td>
      <td>$${saldoInsoluto.toFixed(2)}</td>
      <td>$${amortizacionCapital.toFixed(2)}</td>
      <td>$${interesDelPeriodo.toFixed(2)}</td>
      <td>$${ivaSobreInteres.toFixed(2)}</td>
      <td>$${pagoMensualTotal.toFixed(2)}</td>
      <td>$${saldoFinalPeriodo.toFixed(2)}</td>
    `;
    tablaBody.appendChild(fila);

    // Actualizar saldo insoluto para la siguiente iteración
    saldoInsoluto = saldoFinalPeriodo;
  }
}