document.getElementById('btn-calcular').addEventListener('click', procesarSimulacion);

const formatoMoneda = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function procesarSimulacion() {
    const montoInput = parseFloat(document.getElementById('monto').value);
    const tasaAnualInput = parseFloat(document.getElementById('tasa').value) / 100;
    const plazoMeses = parseInt(document.getElementById('plazo').value, 10);
    const IVA_VALOR = 0.16;

    const errorMsg = document.getElementById('error-msg');
    const resultados = document.getElementById('resultados');

    // Validación de entradas
    if (
        isNaN(montoInput) || montoInput <= 0 ||
        isNaN(tasaAnualInput) || tasaAnualInput < 0 ||
        isNaN(plazoMeses) || plazoMeses <= 0
    ) {
        errorMsg.textContent = 'Ingrese parámetros numéricos válidos (montos y tasas positivos) e intente nuevamente.';
        errorMsg.hidden = false;
        resultados.hidden = true;
        return;
    }
    errorMsg.hidden = true;

    const amortizacionCapital = montoInput / plazoMeses;
    const tasaMensualEquivalente = tasaAnualInput / 12;

    let saldoInsoluto = montoInput;
    const tablaBody = document.querySelector('#tabla-amortizacion tbody');
    tablaBody.innerHTML = '';

    let acumuladoPagos = 0;
    let acumuladoInteres = 0;
    let acumuladoIVA = 0;

    for (let periodo = 1; periodo <= plazoMeses; periodo++) {
        const saldoInicial = saldoInsoluto;
        const interesDelPeriodo = saldoInsoluto * tasaMensualEquivalente;
        const ivaSobreInteres = interesDelPeriodo * IVA_VALOR;
        const pagoMensualTotal = amortizacionCapital + interesDelPeriodo + ivaSobreInteres;

        saldoInsoluto -= amortizacionCapital;
        // Evita residuos negativos por redondeo en el último periodo
        if (periodo === plazoMeses || saldoInsoluto < 0.005) {
            saldoInsoluto = 0;
        }

        acumuladoPagos += pagoMensualTotal;
        acumuladoInteres += interesDelPeriodo;
        acumuladoIVA += ivaSobreInteres;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${periodo}</td>
            <td>${formatoMoneda.format(saldoInicial)}</td>
            <td>${formatoMoneda.format(amortizacionCapital)}</td>
            <td>${formatoMoneda.format(interesDelPeriodo)}</td>
            <td>${formatoMoneda.format(ivaSobreInteres)}</td>
            <td>${formatoMoneda.format(pagoMensualTotal)}</td>
            <td>${formatoMoneda.format(saldoInsoluto)}</td>
        `;
        tablaBody.appendChild(fila);
    }

    // Resumen
    document.getElementById('pago-promedio').textContent = formatoMoneda.format(acumuladoPagos / plazoMeses);
    document.getElementById('total-interes').textContent = formatoMoneda.format(acumuladoInteres);
    document.getElementById('total-iva').textContent = formatoMoneda.format(acumuladoIVA);
    document.getElementById('total-pagar').textContent = formatoMoneda.format(acumuladoPagos);

    resultados.hidden = false;
}