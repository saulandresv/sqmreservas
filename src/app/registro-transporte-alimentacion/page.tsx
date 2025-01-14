'use client';

import '../globals.css';
import React, { useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ToggleButton, ToggleButtonGroup, Typography, Button } from '@mui/material';
import styles from './styles.module.css';

const AdminVista = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [filterType, setFilterType] = useState('ambos');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [kpis, setKpis] = useState({
    totalSolicitudes: 0,
    porcentajeAlimentacion: 0,
    porcentajeTransporte: 0,
    promedioDiario: 0,
  });

  const solicitudes = [
    { id: 1, empleado: 'Ana Pérez', tipo: 'Alimentación', detalle: 'Dieta Vegetariana', fecha: '2023-01-01' },
    { id: 2, empleado: 'Juan López', tipo: 'Transporte', detalle: 'Bus 2, Ida y vuelta', fecha: '2023-01-02' },
    { id: 3, empleado: 'Carlos Gómez', tipo: 'Alimentación', detalle: 'Sin gluten', fecha: '2023-01-03' },
    { id: 4, empleado: 'María Torres', tipo: 'Transporte', detalle: 'Bus 1, Solo ida', fecha: '2023-01-04' },
  ];

  const filtrarSolicitudes = () => {
    const { from, to } = dateRange || {};

    const filtered = solicitudes.filter((solicitud) => {
      const solicitudFecha = new Date(solicitud.fecha);
      const fechaValida =
        (!from || solicitudFecha >= from) && (!to || solicitudFecha <= to);
      const tipoValido =
        filterType === 'ambos' || solicitud.tipo.toLowerCase() === filterType;

      return fechaValida && tipoValido;
    });

    const totalSolicitudes = filtered.length;
    const totalAlimentacion = filtered.filter((s) => s.tipo === 'Alimentación').length;
    const totalTransporte = filtered.filter((s) => s.tipo === 'Transporte').length;
    const diasRango =
      from && to
        ? (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1
        : 1;

    setKpis({
      totalSolicitudes,
      porcentajeAlimentacion: (totalAlimentacion / totalSolicitudes) * 100 || 0,
      porcentajeTransporte: (totalTransporte / totalSolicitudes) * 100 || 0,
      promedioDiario: totalSolicitudes / diasRango || 0,
    });

    setFilteredData(filtered);
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Vista Administrador: Alimentación y Transporte
      </Typography>

      <div className={styles.dateHourContainer}>
        <div className={styles.datePicker}>
          <Typography variant="h6">Seleccionar Rango de Fechas:</Typography>
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
          />
        </div>

        <div className={styles.tripTypeContainer}>
          <Typography variant="h6">Tipo de Solicitud:</Typography>
          <ToggleButtonGroup
            value={filterType}
            exclusive
            onChange={(e, value) => setFilterType(value || 'ambos')}
            className={styles.toggleButtonGroup}
          >
            <ToggleButton value="alimentación" className={styles.toggleButton}>
              Alimentación
            </ToggleButton>
            <ToggleButton value="transporte" className={styles.toggleButton}>
              Transporte
            </ToggleButton>
            <ToggleButton value="ambos" className={styles.toggleButton}>
              Ambos
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      <Button variant="contained" color="primary" onClick={filtrarSolicitudes} className={styles.submitButton}>
        Aplicar Filtros
      </Button>

      <div className={styles.kpiSection}>
        <Typography variant="h6">Indicadores Clave (KPI):</Typography>
        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <Typography variant="subtitle1">Total Solicitudes:</Typography>
            <Typography variant="h5">{kpis.totalSolicitudes}</Typography>
          </div>
          <div className={styles.kpi}>
            <Typography variant="subtitle1">% Alimentación:</Typography>
            <Typography variant="h5">{kpis.porcentajeAlimentacion.toFixed(2)}%</Typography>
          </div>
          <div className={styles.kpi}>
            <Typography variant="subtitle1">% Transporte:</Typography>
            <Typography variant="h5">{kpis.porcentajeTransporte.toFixed(2)}%</Typography>
          </div>
          <div className={styles.kpi}>
            <Typography variant="subtitle1">Promedio Diario:</Typography>
            <Typography variant="h5">{kpis.promedioDiario.toFixed(2)}</Typography>
          </div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <Typography variant="h6">Solicitudes:</Typography>
        <table className={styles.previewTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Empleado</th>
              <th>Tipo</th>
              <th>Detalle</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((solicitud, index) => (
              <tr key={index}>
                <td>{solicitud.id}</td>
                <td>{solicitud.empleado}</td>
                <td>{solicitud.tipo}</td>
                <td>{solicitud.detalle}</td>
                <td>{solicitud.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVista;
