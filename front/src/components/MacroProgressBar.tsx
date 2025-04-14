import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import api from '../services/api';
import { use } from 'framer-motion/client';

interface MacroProgressBarProps {
  label: string;
  value: number;
  targetValue: number;
  color: string;
}

const MacroProgressBar: React.FC<MacroProgressBarProps> = ({ label, value, targetValue, color }) => {
  const progress = Math.min((value / targetValue) * 100, 100);

  return (
    <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          {label}
        </Typography>
        <Box sx={{ position: 'relative' }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#f2f2f2',
              '& .MuiLinearProgress-bar': { backgroundColor: color },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              padding: 1,
            }}
          >
            <Typography variant="body2" fontWeight={600} sx={{ mt: '18px', fontSize: '13px' }}>
              {value}g | {targetValue}g
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

const MacroTracker: React.FC = () => {
  const [macros, setMacros] = useState({
    protein: { value: 0, target: 0 },
    fat: { value: 0, target: 0 },
    carbs: { value: 0, target: 0 },
  });


  useEffect(() => {
    // Função para buscar os dados nutricionais do backend
    const fetchNutritionalData = async () => {
      try {
        const user_id = localStorage.getItem('userId'); 

        if (!user_id) {
          console.error("User ID não encontrado no localStorage");
          return;
        }

        const response = await api.get(`/ref?user_id=${user_id}`);
        console.log(response.data);
        const data = response.data.user_data; 

        const goals = await api.get(`/goals?user_id=${user_id}`);
        const currentGoals = goals.data;
        console.log(currentGoals);
        
        setMacros({
          protein: { value: data.protein, target : currentGoals.proteinGoal }, 
          fat: { value: data.fat, target: currentGoals.fatGoal }, 
          carbs: { value: data.carb, target: currentGoals.carbGoal }, 
        });
      } catch (error) {
        console.error('Erro ao buscar dados nutricionais:', error);
      }
    };

    fetchNutritionalData();
  }, []); // Executa a função ao carregar o componente

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" color="secondary" fontWeight={600}>
        Meta de Macronutrientes
      </Typography>
      <MacroProgressBar
        label="Proteínas"
        value={macros.protein.value}
        targetValue={macros.protein.target}
        color="#4caf50"                  
      />
      <MacroProgressBar
        label="Gorduras"
        value={macros.fat.value}
        targetValue={macros.fat.target}
        color="#ff9800"
      />
      <MacroProgressBar
        label="Carboidratos"
        value={macros.carbs.value}
        targetValue={macros.carbs.target}
        color="#2196f3"
      />
    </Box>
  );
};

export default MacroTracker;
