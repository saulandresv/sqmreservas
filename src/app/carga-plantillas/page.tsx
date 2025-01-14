'use client';

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.css';

const CargaPlantillas = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [summary, setSummary] = useState({
    correct: 0,
    errors: 0,
  });
  const [validations, setValidations] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<string[]>([]);

  // Función para manejar el archivo y actualizar el estado
  const handleFile = (file: File) => {
    if (file) {
      console.log('Archivo cargado:', file.name);
      // Aquí puedes agregar lógica real para procesar el archivo
      // Por ahora, usamos datos simulados
      setSummary({ correct: 50, errors: 2 });
      setValidations([
        'Horarios solapados detectados para el trabajador Ana Pérez.',
        'Restricciones dietéticas no especificadas para el trabajador Juan López.',
      ]);
      setPreviewData([
        '10.223.232-0, Ana Pérez, SANTIAGO CENTRO, null, Bus 5, Vegetariano',
        '21.123.425-6, Mario Torres, LA SERENA, null, Bus 3, Sin restricciones',
        '9.232.123-0, Juan López, LA SERENA, null, Bus 3, Sin restricciones',
      ]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file as File);
    // Reiniciar el input para permitir cargar el mismo archivo nuevamente si es necesario
    event.target.value = '';
  };

  const handleSubmitSuccess = () => {
    toast.success('Datos enviados correctamente.', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const handleSubmitError = () => {
    toast.error('Error al enviar los datos: No se pudo conectar a la base de datos.', {
      position: 'top-right',
      autoClose: 5000,
    });
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h1 className={styles.title}>Carga de Plantillas de Trabajadores con Turno</h1>

      {/* Área de arrastrar y soltar */}
      <div
        className={`${styles.dropArea} ${isDragOver ? styles.dragOver : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>{isDragOver ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo aquí, o usa el botón de abajo'}</p>

        {/* Botón de carga */}
        <div className={styles.uploadSection}>
          <label htmlFor="file-upload" className={styles.uploadButton}>
            <span>Seleccionar Archivo Excel</span>
            <input
              type="file"
              id="file-upload"
              accept=".xlsx, .xls"
              onChange={handleFileChange} // Agregado manejador de cambio
            />
          </label>
        </div>
      </div>
      
      {/* Vista Previa */}
<div className={styles.previewSection}>
  <h2>Vista Previa</h2>
  {previewData.length > 0 ? (
    <table className={styles.previewTable}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Región</th>
          <th>Turno</th>
          <th>Bus Asignado</th>
        </tr>
      </thead>
      <tbody>
        {previewData.map((row, index) => {
          const columns = row.split(', '); // Asegúrate de que los datos estén en este formato
          return (
            <tr key={index}>
              <td>{columns[0]}</td>
              <td>{columns[1]}</td>
              <td>{columns[2]}</td>
              <td>{columns[3]}</td>
              <td>{columns[4]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <p>No hay datos para mostrar. Por favor, carga un archivo.</p>
  )}
</div>


      {/* Resumen de Carga */}
      <div className={styles.summarySection}>
        <h2>Resumen de Carga</h2>
        <p>
          Registros cargados correctamente: <span className={styles.successCount}>{summary.correct}</span>
        </p>
        <p>
          Errores encontrados: <span className={styles.errorCount}>{summary.errors}</span>
        </p>
      </div>

      {/* Validaciones Básicas */}
      <div className={styles.validationSection}>
        <h2>Validaciones</h2>
        <ul>
          {validations.map((validation, index) => (
            <li key={index}>{validation}</li>
          ))}
        </ul>
      </div>

      {/* Botones para Enviar */}
      <div className={styles.submitSection}>
        <button className={styles.submitButton} onClick={handleSubmitSuccess}>
          Enviar Correctamente
        </button>
        <button className={styles.errorButton} onClick={handleSubmitError}>
          Simular Error al Enviar
        </button>
      </div>
    </div>
  );
};

export default CargaPlantillas;
