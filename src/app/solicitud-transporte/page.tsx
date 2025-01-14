'use client';

import React, { useState, useCallback } from 'react';
import styles from './styles.module.css';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

// Importaciones de MUI
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

const SolicitudTransporte = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<number | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<{ row: number; col: number } | null>(null);
  const [comentarios, setComentarios] = useState<string>('');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Barra de búsqueda
  const [tripType, setTripType] = useState<'ida' | 'vuelta' | null>(null); // Tipo de viaje

  // Datos de los buses
  const busesDisponibles = [
    {
      id: 1,
      bus: 'Bus 1',
      empresa: 'Turbus',
      asientos: [
        [1, 1, 0, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 0],
        [0, 1, 1, 1],
      ],
    },
    {
      id: 2,
      bus: 'Bus 2',
      empresa: 'Pullman',
      asientos: [
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [1, 0, 1, 1],
      ],
    },
    {
      id: 3,
      bus: 'Bus 3',
      empresa: 'Cikbus',
      asientos: [
        [1, 1, 0, 1],
        [0, 1, 0, 1],
        [1, 1, 1, 1],
        [0, 0, 0, 1],
      ],
    },
  ];

  const availableHours = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  // Función para manejar la carga de archivos
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setArchivos((prevFiles) => [...prevFiles, ...acceptedFiles]);
    toast.success(`${acceptedFiles.length} archivo(s) cargado(s) exitosamente.`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  });

  const handleSubmit = () => {
    if (!dateRange || !dateRange.from || !dateRange.to || !selectedHour || selectedBus === null || selectedSeat === null || !tripType) {
      toast.error('Por favor completa todos los campos antes de enviar la solicitud.');
      return;
    }
    toast.success(`Solicitud enviada para el rango del ${dateRange.from.toLocaleDateString()} al ${dateRange.to.toLocaleDateString()} (${tripType}) a las ${selectedHour}.`);
    setDateRange(undefined);
    setSelectedHour(null);
    setSelectedBus(null);
    setSelectedSeat(null);
    setComentarios('');
    setArchivos([]);
    setTripType(null);
    setSearchQuery('');
  };

  const handleSimulateError = () => {
    toast.error('Error al enviar la solicitud. Por favor, intenta nuevamente.');
  };

  return (
    <div className={styles.container}>
      <ToastContainer />

      <Typography variant="h4" className={styles.title}>
        Modificación de Transporte
      </Typography>

      {/* Barra de búsqueda */}
      <div className={styles.formGroup}>
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar trabajador..."
          variant="outlined"
          fullWidth
        />
      </div>

      {/* Botones de Ida y Vuelta */}
      <div className={styles.tripTypeContainer}>
        <Typography variant="h6">Tipo de Viaje:</Typography>
        <ToggleButtonGroup
          value={tripType}
          exclusive
          onChange={(e, value) => setTripType(value)}
          className={styles.toggleButtonGroup}
        >
          <ToggleButton value="ida" className={styles.toggleButton}>
            Ida
          </ToggleButton>
          <ToggleButton value="vuelta" className={styles.toggleButton}>
            Vuelta
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className={styles.dateHourContainer}>
        {/* Reemplazo del calendario */}
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
          />
        {/* Contenedor de horas */}
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

      {/* Lista de buses y mapa de asientos */}
      <div className={styles.busesAndSeatsContainer}>
        <div className={styles.busesList}>
          <Typography variant="h6">Buses Disponibles</Typography>
          <List>
            {busesDisponibles.map((bus) => (
              <ListItem key={bus.id} disablePadding>
                <ListItemButton
                  selected={selectedBus === bus.id}
                  onClick={() => {
                    setSelectedBus(bus.id);
                    setSelectedSeat(null); // Reset seat selection when switching buses
                  }}
                >
                  <ListItemText
                    primary={`${bus.bus} - ${bus.empresa}`}
                    secondary={`Asientos disponibles: ${
                      bus.asientos.flat().filter((seat) => seat === 1).length
                    }`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>

        {/* Mapa de asientos */}
        {selectedBus !== null && (
          <div className={styles.seatMap}>
            <Typography variant="h6">Mapa de Asientos</Typography>
            <Box className={styles.grid}>
              {busesDisponibles
                .find((bus) => bus.id === selectedBus)!
                .asientos.flatMap((fila, rowIndex) =>
                  fila.map((seat, colIndex) => (
                    <Box
                      key={`${rowIndex}-${colIndex}`}
                      className={`${styles.seat} ${
                        seat === 0
                          ? styles.unavailableSeat
                          : selectedSeat?.row === rowIndex && selectedSeat?.col === colIndex
                          ? styles.selectedSeat
                          : styles.availableSeat
                      }`}
                      onClick={() => seat === 1 && setSelectedSeat({ row: rowIndex, col: colIndex })}
                    />
                  ))
                )}
            </Box>
          </div>
        )}
      </div>

      {/* Área de comentarios */}
      <div className={styles.formGroup}>
        <Typography variant="h6">Comentarios Adicionales:</Typography>
        <TextField
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          placeholder="Escribe aquí cualquier comentario adicional..."
          multiline
          rows={4}
          variant="outlined"
          fullWidth
        />
      </div>

      {/* Área de carga de archivos */}
      <Box {...getRootProps()} className={`${styles.dropArea} ${isDragActive ? styles.dragOver : ''}`}>
        <input {...getInputProps()} />
        <Typography>
          {isDragActive ? 'Suelta los archivos aquí...' : 'Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos'}
        </Typography>
      </Box>

      {/* Botones de acción */}
      <div className={styles.submitSection}>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Enviar Solicitud
        </button>
        <button className={styles.errorButton} onClick={handleSimulateError}>
          Simular Error al Enviar Solicitud
        </button>
      </div>
    </div>
  );
};

export default SolicitudTransporte;
