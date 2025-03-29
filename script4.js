document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Valores de prueba
      const data = { porcentaje: 100 }; // Ejemplo: Porcentaje del 65% que recibimos
      const porcentaje = data.porcentaje;

      const p = document.getElementById('porcentaje3');
        if (p) {
        p.innerText = `120%`; // Si el elemento existe, actualiza su contenido
        }

  
      const ctx = document.getElementById('doughnutChart3').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          /*labels: ['Porcentaje', 'Restante'],*/
          datasets: [{
            data: [porcentaje, 100-porcentaje], //100 = el promedio por seccion 
            backgroundColor: ['#e04932', '#e9ecef'],
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