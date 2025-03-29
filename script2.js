document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Valores de prueba
      const data = { porcentaje: 95 }; // Ejemplo: Porcentaje del 65% que recibimos
      const porcentaje = data.porcentaje;

      const p = document.getElementById('porcentaje');
        if (p) {
        p.innerText = `${porcentaje}%`; // Si el elemento existe, actualiza su contenido
        }

  
      const ctx = document.getElementById('doughnutChart').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          /*labels: ['Porcentaje', 'Restante'],*/
          datasets: [{
            data: [porcentaje, 100-porcentaje], //100 = el promedio por seccion 
            backgroundColor: ['#4caf50', '#e9ecef'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.raw + '%';
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error al generar el gráfico:', error);
    }
  });