document.addEventListener('DOMContentLoaded', () => {
    const formReserva = document.getElementById('formReserva');
    const btnWhatsApp = document.getElementById('btnWhatsApp');

    // Número de teléfono de la barbería para WhatsApp (Formato internacional sin el +)
    const NUMERO_BARBERIA = "51978974338";

    if (formReserva) {
        formReserva.addEventListener('submit', async (e) => {
            e.preventDefault();

            const datosReserva = {
                nombre: document.getElementById('nombre').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                servicio: document.getElementById('servicio').value,
                corte: document.getElementById('corte').value,
                barba: document.getElementById('barba').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value
            };

            try {
                const response = await fetch('/api/reservar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosReserva)
                });

                const data = await response.json();

                if (data.success) {
                    alert('¡Cita agendada exitosamente en el sistema!');
                    formReserva.reset();
                } else {
                    alert('Error al agendar la cita: ' + data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                alert('Ocurrió un error en la reserva. Revisa tu conexión.');
            }
        });
    }

    // Botón de Reserva Directa por WhatsApp
    if (btnWhatsApp) {
        btnWhatsApp.addEventListener('click', () => {
            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const servicio = document.getElementById('servicio').value;
            const corte = document.getElementById('corte').value;
            const barba = document.getElementById('barba').value;
            const fecha = document.getElementById('fecha').value;
            const hora = document.getElementById('hora').value;

            if (!nombre || !telefono || !servicio || !fecha || !hora) {
                alert('Por favor completa al menos Nombre, WhatsApp, Servicio, Fecha y Hora para agendar por WhatsApp.');
                return;
            }

            let mensaje = `👋 Hola *BH Barber House*, quiero confirmar una cita:\n\n`;
            mensaje += `👤 *Nombre:* ${nombre}\n`;
            mensaje += `📱 *Teléfono:* ${telefono}\n`;
            mensaje += `✂️ *Servicio:* ${servicio}\n`;
            if (corte) mensaje += `💈 *Corte:* ${corte}\n`;
            if (barba) mensaje += `🧔 *Barba:* ${barba}\n`;
            mensaje += `📅 *Fecha:* ${fecha}\n`;
            mensaje += `⏰ *Hora:* ${hora}\n\n`;
            mensaje += `¿Tienen disponibilidad asignada?`;

            const url = `https://api.whatsapp.com/send?phone=${NUMERO_BARBERIA}&text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        });
    }
});