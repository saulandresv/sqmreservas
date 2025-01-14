'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importaciones de MUI
import {
  Typography,
  TextField,
  Box,
} from '@mui/material';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const ModuloAlimentacion = () => {
  const [tipoDieta, setTipoDieta] = useState<string | null>(null);
  const [personalizada, setPersonalizada] = useState<string>('');
  const [comentarios, setComentarios] = useState<string>('');
  const [rangoFechas, setRangoFechas] = useState<'permanente' | 'rango'>('permanente');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [buscador, setBuscador] = useState<string>('');

  const handleGuardarCambios = () => {
    if (!tipoDieta) {
      toast.error('Por favor selecciona un tipo de dieta antes de guardar.');
      return;
    }
    toast.success('Solicitud de dieta guardada exitosamente.');
  };

  const handleSimularError = () => {
    toast.error('Error al guardar la solicitud. Por favor, intenta nuevamente.');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.container}>
        <ToastContainer />

        {/* Título */}
        <Typography variant="h4" className={styles.title}>
          Modificación de Dieta
        </Typography>

        {/* Buscador */}
        <Box className={styles.searchContainer}>
          <TextField
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
            placeholder="Buscar trabajador..."
            variant="outlined"
            fullWidth
          />
        </Box>

        {/* Rango de Fechas */}
        <Box className={styles.rangeDateContainer}>
          {/* Contenedor del título, botones y texto */}
          <Box className={styles.rangeOptionsContainer}>
            <Typography variant="h6" className={styles.rangeTitle}>
              Rango de Fechas
            </Typography>

            <ToggleButtonGroup
              value={rangoFechas}
              exclusive
              onChange={(e, value) => setRangoFechas(value)}
              className={styles.toggleButtonGroup}
            >
              <ToggleButton
                value="permanente"
                className={`${styles.toggleButton} ${styles.largeButton}`}
              >
                Permanente
              </ToggleButton>
              <ToggleButton
                value="rango"
                className={`${styles.toggleButton} ${styles.largeButton}`}
              >
                Rango de Fechas
              </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="body2" className={styles.infoText}>
              En caso de seleccionar un rango de fechas, los cambios entrarán en vigor a partir del momento en que se efectúe la modificación o desde el próximo turno laboral del trabajador correspondiente.
            </Typography>
          </Box>

          {/* Contenedor del calendario */}
          <Box
            className={`${styles.datePicker} ${
              rangoFechas === 'permanente' ? styles.disabled : ''
            }`}
          >
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              disabled={rangoFechas === 'permanente'}
            />
          </Box>
        </Box>

        {/* Tipos de Dieta */}
        <Box className={styles.dietTypeContainer}>
          <Typography variant="h6">Tipos de Dieta</Typography>
          <div className={styles.dietTypeButtons}>
            {[
              'Vegetariana',
              'Vegana',
              'Baja en Sodio',
              'Alta en Proteínas',
              'Sin Gluten',
              'Dieta de Baja Carga Glucémica',
              'Dieta Keto',
              'Dieta Baja en Carbohidratos',
              'Personalizada',
            ].map((tipo, index) => (
              <button
                key={index}
                className={`${styles.dietTypeButton} ${
                  tipoDieta === tipo ? styles.selectedDietTypeButton : ''
                }`}
                onClick={() => setTipoDieta(tipo)}
              >
                {tipo}
              </button>
            ))}
          </div>
</Box>


        {/* Área de Dieta Personalizada */}
        {tipoDieta === 'Personalizada' && (
          <Box className={styles.formGroup}>
            <Typography variant="h6">Dieta Personalizada</Typography>
            <TextField
              value={personalizada}
              onChange={(e) => setPersonalizada(e.target.value)}
              placeholder="Escribe tu dieta personalizada..."
              multiline
              rows={3}
              variant="outlined"
              fullWidth
            />
          </Box>
        )}

        {/* Restricciones Adicionales */}
        <Box className={styles.formGroup}>
          <Typography variant="h6">Restricciones Adicionales</Typography>
          <TextField
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            placeholder="Indica alergias alimentarias, intolerancias o preferencias específicas (por ejemplo, sin lácteos, sin frutos secos, etc.)."
            multiline
            rows={4}
            variant="outlined"
            fullWidth
          />
        </Box>

        {/* Botones de Acción */}
        <Box className={styles.submitSection}>
          <button className={styles.submitButton} onClick={handleGuardarCambios}>
            Guardar Cambios
          </button>
          <button className={styles.errorButton} onClick={handleSimularError}>
            Simular Error
          </button>
        </Box>
      </div>
    </LocalizationProvider>
  );
};

export default ModuloAlimentacion;
