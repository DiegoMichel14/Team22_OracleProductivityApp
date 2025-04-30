// import React, { useEffect, useRef } from 'react';

// function ProductividadGrafico({ datos }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const anchoBarra = 80; // Barras más anchas
//     const separacion = 200; // Más separación
//     const alturaMaxima = 400; // Altura total de la gráfica

//     datos.forEach((d, i) => {
//       const xGrupo = i * (anchoBarra + separacion) + 300; // Mayor espacio inicial
//       const xEstimadas = xGrupo;
//       const xReales = xGrupo + anchoBarra + 30;
//       const xCostos = xReales + anchoBarra + 30;

//       // Dibujar barras
//       ctx.fillStyle = "blue"; // Horas estimadas
//       ctx.fillRect(xEstimadas, alturaMaxima - d[1], anchoBarra, d[1]);

//       ctx.fillStyle = "red"; // Horas reales
//       ctx.fillRect(xReales, alturaMaxima - d[2], anchoBarra, d[2]);

//       ctx.fillStyle = "green"; // Costos en USD
//       ctx.fillRect(xCostos, alturaMaxima - (d[4] / 2), anchoBarra, d[4] / 2);

//       // Agregar etiquetas sobre las barras
//       ctx.fillStyle = "white";
//       ctx.font = "16px Arial";
//       ctx.fillText(`Horas estimadas: ${d[1]}`, xEstimadas + 10, alturaMaxima - d[1] - 10);
//       ctx.fillText(`Horas Reales: ${d[2]}`, xReales + 10, alturaMaxima - d[2] - 10);
//       ctx.fillText(`Costo total: $${Math.round(d[4])}`, xCostos + 10, alturaMaxima - (d[4] / 2) - 10);

//       // Agregar nombres de los sprints abajo
//       ctx.fillStyle = "white";
//       ctx.fillText(d[0], xGrupo, alturaMaxima + 30);
//     });
//   }, [datos]);

//   return (
//     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", margin: "auto" }}>
//       <canvas ref={canvasRef} width={1200} height={500} style={{ display: "block" }} />
//     </div>
//   );
// }

// export default ProductividadGrafico;




import React, { useEffect, useRef } from 'react';

function ProductividadGrafico({ datos }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Parámetros de diseño
    const anchoBarra    = 80;
    const separacion    = 200;
    const alturaTotal   = 400;  // altura "lógica" de la gráfica
    const marginTop     = 20;
    const marginBottom  = 50;
    const alturaUsable  = alturaTotal - marginTop - marginBottom;

    // 1. Calcula el valor máximo de todas las series
    const todosLosValores = datos.flatMap(d => [
      d[1],         // horas estimadas
      d[2],         // horas reales
      d[4] / 2      // costos escalados (tu lógica original)
    ]);
    const valorMaximo = Math.max(...todosLosValores);

    // 2. Factor de conversión horas → píxeles
    const escala = alturaUsable / valorMaximo;

    // 3. Línea de base (eje X) en coordenada Y
    const yBase = alturaTotal - marginBottom;

    // 4. Dibuja cada grupo de barras
    datos.forEach((d, i) => {
      const xGrupo   = i * (anchoBarra + separacion) + 300;
      const xEst     = xGrupo;
      const xReal    = xGrupo + anchoBarra + 30;
      const xCostos  = xReal + anchoBarra + 30;

      // alturas escaladas
      const hEst    = d[1] * escala;
      const hReal   = d[2] * escala;
      const hCosto  = (d[4] / 2) * escala;

      // Barras
      ctx.fillStyle = 'blue';
      ctx.fillRect(xEst,   yBase - hEst,   anchoBarra, hEst);

      ctx.fillStyle = 'red';
      ctx.fillRect(xReal,  yBase - hReal,  anchoBarra, hReal);

      ctx.fillStyle = 'green';
      ctx.fillRect(xCostos,yBase - hCosto, anchoBarra, hCosto);

      // Etiquetas de datos
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(`Horas estimadas: ${d[1]}`, xEst + 10,    yBase - hEst   - 10);
      ctx.fillText(`Horas reales:    ${d[2]}`, xReal + 10,  yBase - hReal  - 10);
      ctx.fillText(`Costo total: $${Math.round(d[4])}`, xCostos + 10, yBase - hCosto - 10);

      // Nombre del sprint debajo
      ctx.fillText(d[0], xGrupo, yBase + 30);
    });
  }, [datos]);

  return (
    <div style={{
      display:        'flex',
      justifyContent: 'center',
      alignItems:     'center',
      width:          '100%',
      margin:         'auto'
    }}>
      <canvas
        ref={canvasRef}
        width={1200}
        height={500}
        style={{ display: 'block' }}
      />
    </div>
  );
}

export default ProductividadGrafico;