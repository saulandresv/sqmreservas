'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importaciones de MUI
import {
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from '@mui/material';

const ModuloSalas = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedSala, setSelectedSala] = useState<string | null>(null);
  const [cantidadPersonas, setCantidadPersonas] = useState<number>(0);
  const [reservas, setReservas] = useState<any[]>([]);
  const [searchWorker, setSearchWorker] = useState<string>('');

  const salasDisponibles = [
    'Quincho Cerrado 1',
    'Quincho Cerrado 2',
    'Quincho Abierto 1',
    'Quincho Abierto 2',
    'Sala de Recreación',
    'Sala de Capacitación',
    'Sala SAP',
  ];

  const availableHours = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
  ];

  const handleReserva = () => {
    if (!selectedSala || !dateRange?.from || cantidadPersonas <= 0 || !selectedHour) {
      toast.error('Por favor, completa todos los campos antes de realizar la reserva.');
      return;
    }

    const nuevaReserva = {
      sala: selectedSala,
      fecha: `${dateRange.from.toLocaleDateString()} ${dateRange.to ? `- ${dateRange.to.toLocaleDateString()}` : ''}`,
      hora: selectedHour,
      cantidadPersonas,
    };

    setReservas([...reservas, nuevaReserva]);
    setSelectedSala(null);
    setDateRange(undefined);
    setCantidadPersonas(0);
    setSelectedHour(null);
    toast.success('Reserva realizada exitosamente.');
  };

  const handleCancelarReserva = (index: number) => {
    const nuevasReservas = [...reservas];
    nuevasReservas.splice(index, 1);
    setReservas(nuevasReservas);
    toast.info('Reserva cancelada.');
  };

  return (
    <div className={styles.container}>
      <ToastContainer />

      <Typography variant="h4" className={styles.title}>
        Modificación de Salas y Quinchos
      </Typography>

      {/* Barra de búsqueda */}
      <Box className={styles.searchContainer}>
        <TextField
          value={searchWorker}
          onChange={(e) => setSearchWorker(e.target.value)}
          placeholder="Buscar trabajador..."
          variant="outlined"
          fullWidth
        />
      </Box>

      {/* Botones de selección de sala */}
      <Box className={styles.salaContainer}>
        <Typography variant="h6" className={styles.salaTitle}>
          Seleccionar Sala/Quincho:
        </Typography>
        <ToggleButtonGroup
          value={selectedSala}
          exclusive
          onChange={(e, value) => setSelectedSala(value)}
          className={styles.toggleButtonGroup}
        >
          {salasDisponibles.map((sala, index) => (
            <ToggleButton
              key={index}
              value={sala}
              className={`${styles.toggleButton} ${selectedSala === sala ? styles.selectedButton : ''}`}
            >
              {sala}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <div className={styles.dateHourContainer}>
        {/* Calendario */}
        <DayPicker
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
        />

        {/* Horas disponibles */}
        <Box className={styles.hourContainer}>
          <Typography variant="h6">Horas Disponibles</Typography>
          <div className={styles.hourButtons}>
            {availableHours.map((hour, index) => (
              <Button
                key={index}
                variant={selectedHour === hour ? 'contained' : 'outlined'}
                onClick={() => setSelectedHour(hour)}
                className={styles.hourButton}
              >
                {hour}
              </Button>
            ))}
          </div>
        </Box>
      </div>

      {/* Cantidad de personas */}
      <Box className={styles.personasContainer}>
        <Typography variant="h6">Cantidad de Personas:</Typography>
        <TextField
          type="number"
          value={cantidadPersonas}
          onChange={(e) => setCantidadPersonas(Number(e.target.value))}
          placeholder="Ejemplo: 10"
          fullWidth
        />
      </Box>

      {/* Botón para Reservar */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleReserva}
        className={styles.submitButton}
      >
        Reservar
      </Button>

      {/* Listado de reservas */}
      <div className={styles.reservasContainer}>
        {reservas.map((reserva, index) => (
          <Box
            key={index}
            className={styles.reservaItem}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Typography>
              <strong>Sala:</strong> {reserva.sala}
            </Typography>
            <Typography>
              <strong>Fecha:</strong> {reserva.fecha}
            </Typography>
            <Typography>
              <strong>Hora:</strong> {reserva.hora}
            </Typography>
            <Typography>
              <strong>Personas:</strong> {reserva.cantidadPersonas}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleCancelarReserva(index)}
              className={styles.cancelButton}
            >
              Cancelar
            </Button>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default ModuloSalas;
