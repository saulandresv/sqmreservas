'use client';

import React, { useState, useCallback } from 'react';
import styles from './styles.module.css';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importaciones de MUI
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';

const SolicitudTransporte = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [comentarios, setComentarios] = useState<string>('');
  const [archivos, setArchivos] = useState<File[]>([]);

  // Horas disponibles
  const availableHours = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  // Buses disponibles
  const busesDisponibles = [
    { bus: 'Bus 1', asientos: 5 },
    { bus: 'Bus 2', asientos: 0 },
    { bus: 'Bus 3', asientos: 2 },
  ];

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
    if (!selectedDate || !selectedHour || !selectedBus) {
      toast.error('Por favor selecciona una fecha, una hora y un bus disponible antes de enviar la solicitud.');
      return;
    }
    toast.success(`Solicitud enviada para el ${selectedDate?.toLocaleDateString()} a las ${selectedHour}.`);
    setSelectedDate(null);
    setSelectedHour(null);
    setSelectedBus('');
    setComentarios('');
    setArchivos([]);
  };

  const handleSimulateError = () => {
    toast.error('Error al enviar la solicitud. Por favor, intenta nuevamente.');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.container}>
        <ToastContainer />

        <Typography variant="h4" className={styles.title}>
          Solicitud de Modificación de Transporte
        </Typography>

        <div className={styles.dateHourContainer}>
          {/* Calendario estático */}
          <Box className={styles.datePicker}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            />
          </Box>

          {/* Contenedor de horas */}
          <Box className={styles.hourContainer}>
            <Typography variant="h6" className={styles.subtitle}>
              Horas Disponibles
            </Typography>
            <div className={styles.hourButtons}>
              {availableHours.map((hour, index) => (
                <Button
                  key={index}
                  variant={selectedHour === hour ? 'contained' : 'outlined'}
                  color={selectedHour === hour ? 'success' : 'primary'}
                  onClick={() => setSelectedHour(hour)}
                  className={styles.hourButton}
                >
                  {hour}
                </Button>
              ))}
            </div>
          </Box>
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

        {/* Lista de buses */}
        <div className={styles.options}>
          <Typography variant="h6">Buses Disponibles</Typography>
          <List>
            {busesDisponibles.map((bus, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  disabled={bus.asientos === 0}
                  selected={selectedBus === bus.bus}
                  onClick={() => bus.asientos > 0 && setSelectedBus(bus.bus)}
                >
                  <ListItemText primary={`${bus.bus} - Asientos disponibles: ${bus.asientos}`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>

        {/* Área de carga de archivos */}
        <Box {...getRootProps()} className={`${styles.dropArea} ${isDragActive ? styles.dragOver : ''}`}>
          <input {...getInputProps()} />
          <Typography>
            {isDragActive ? 'Suelta los archivos aquí...' : 'Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos'}
          </Typography>
          <Button variant="contained" color="primary" className={styles.uploadButton}>
            Seleccionar Archivos
          </Button>
        </Box>

        {/* Lista de archivos cargados */}
        {archivos.length > 0 && (
          <div className={styles.formGroup}>
            <Typography variant="h6">Archivos Cargados:</Typography>
            <List>
              {archivos.map((file, index) => (
                <ListItem key={index}>
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          </div>
        )}

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
    </LocalizationProvider>
  );
};

export default SolicitudTransporte;
