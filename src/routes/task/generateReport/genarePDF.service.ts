import { Injectable } from '@nestjs/common';
import * as PDF from 'pdfkit';
import * as fs from 'fs';

@Injectable()
export class PDFService {
  async generarPdf(
    dateInit,
    dateFinish,
    totalTasks,
    pendiente,
    PorcentPendientes,
    atrasado,
    PorcentAtrasadas,
    realizado,
    PorcentRealizados,
    realizado_tarde,
    PorcentTarde,
    porcentaje,
  ) {
    const doc = new PDF();
    doc.pipe(fs.createWriteStream('PDFGenerate' + 'reporte.pdf'));

    doc
      .font('Times-Bold', 15)
      .text(
        'Reporte gerencial tasa de cumplimiento sobre compromisos asignados',
        80,
      ),
      {
        align: 'Center',
      };
    doc
      .font('Times-Bold')
      .text(
        '______________________________________________________________',
        72,
        75,
      );

    /*
    doc.moveTo(100, 0)       // this is your starting position of the line, from the left side of the screen 200 and from top 200
        .lineTo(100, 0)       // this is the end point the line 
        .dash(1, { space: 1 }) // here we are formatting it to dash
        doc.moveTo(72, 90)   //again we are giving a starting position for the text
        .lineTo(530, 90)       //end point
        .dash(5, {space: 5})   //adding dash
        .stroke()
    */

    doc
      .font('Times-Roman', 12)
      .text(`Fecha de inicio de reporte: ${dateInit}`, 72, 120);
    doc
      .font('Times-Roman', 12)
      .text(`Fecha final de reporte: ${dateFinish}`, 72, 140);

    doc.font('Times-Bold', 12).text(`Total de tareas asignadas:`, 72, 170);
    doc.font('Times-Roman', 12).text(`${totalTasks}`, 210, 170);

    doc
      .font('Times-Roman', 12)
      .text(
        `- Compromisos pendientes: ${pendiente}, esto equivale al ${PorcentPendientes}%`,
        72,
        190,
      );
    doc
      .font('Times-Roman', 12)
      .text(
        `- Compromisos atrasados: ${atrasado}, esto equivale al ${PorcentAtrasadas}%`,
        72,
        210,
      );
    doc
      .font('Times-Roman', 12)
      .text(
        `- Compromisos realizados: ${realizado}, esto equivale al ${PorcentRealizados}%`,
        72,
        230,
      );
    doc
      .font('Times-Roman', 12)
      .text(
        `- Compromisos realizados tardes: ${realizado_tarde}, esto equivale al ${PorcentTarde}%`,
        72,
        250,
      );

    doc
      .font('Times-Roman')
      .text(
        `La sumatoria del equivalente de los compromisos es del: ${porcentaje}%`,
        72,
        280,
      );

    //doc.font('Times-Bold').text('_____________________________________________________________________________',72, 700)
    doc.end();
    console.log('documento generado');

    return {
      PorcentPendientes,
      PorcentAtrasadas,
      PorcentRealizados,
      PorcentTarde,
    };
  }
}
