import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FilterListIcon from '@mui/icons-material/FilterList';
import Button from '../../Common/Button';

interface Period {
  id: string;
  start: number;
  end: number;
  name: string;
  exercises?: any[];
}

interface PeriodoCardProps {
  periodo: Period;
  index: number;
  searchTerm: string;
  filterAnchorEl: null | HTMLElement;
  filters: {
    upperBody: boolean;
    lowerBody: boolean;
    core: boolean;
    cardio: boolean;
  };
  handleApplyPeriod: (periodId: string) => void;
  handleSavePeriodName: (index: number) => void;
  handleEditPeriodName: (index: number, name: string) => void;
  handleDeletePeriod: (index: number) => void;
  handleAdjustPeriod: (index: number, isStart: boolean, increment: boolean) => void;
  handleFilterClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleFilterClose: () => void;
  handleFilterChange: (filterName: 'upperBody' | 'lowerBody' | 'core' | 'cardio') => void;
  filterExercises: (ejercicios: any[]) => any[];
  renderEjercicio: (ejercicio: any) => React.ReactNode;
  getDayOfWeek: (totalDays: number) => number;
  editingPeriodIndex: number | null;
}

const PeriodoCard: React.FC<PeriodoCardProps> = ({
  periodo,
  index,
  searchTerm,
  filterAnchorEl,
  filters,
  handleApplyPeriod,
  handleSavePeriodName,
  handleEditPeriodName,
  handleDeletePeriod,
  handleAdjustPeriod,
  handleFilterClick,
  handleFilterClose,
  handleFilterChange,
  filterExercises,
  renderEjercicio,
  getDayOfWeek,
  editingPeriodIndex
}) => {
  const theme = useTheme();
  
  const startInfo = {
    week: 1,
    day: getDayOfWeek(periodo.start)
  };
  const endInfo = {
    week: 1,
    day: getDayOfWeek(periodo.end)
  };
  const ejercicios = periodo.exercises || [];

  return (
    <Box sx={{ p: 3, mb: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {periodo.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleApplyPeriod(periodo.id)}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              px: 3
            }}
          >
            Aplicar Periodo
          </Button>
          {editingPeriodIndex === index ? (
            <IconButton
              onClick={() => handleSavePeriodName(index)}
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <EditIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleEditPeriodName(index, periodo.name)}
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <EditIcon />
            </IconButton>
          )}
          <IconButton
            onClick={() => handleDeletePeriod(index)}
            sx={{
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => handleAdjustPeriod(index, true, false)}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ 
            color: theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <AccessTimeIcon />
            Semana {startInfo.week} día {startInfo.day}
          </Typography>
          <IconButton
            onClick={() => handleAdjustPeriod(index, true, true)}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Typography variant="subtitle1">a</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => handleAdjustPeriod(index, false, false)}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ 
            color: theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            Semana {endInfo.week} día {endInfo.day}
          </Typography>
          <IconButton
            onClick={() => handleAdjustPeriod(index, false, true)}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {ejercicios.length > 0 ? (
        <Box>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3,
            alignItems: 'center'
          }}>
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '8px 16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {/* This will be handled by the parent */}}
                placeholder="Buscar ejercicios..."
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '16px',
                  backgroundColor: 'transparent'
                }}
                disabled
              />
            </Box>
            <Button
              variant="exportar"
              onClick={handleFilterClick}
              startIcon={<FilterListIcon />}
              sx={{
                minWidth: '120px',
                height: '40px',
                background: 'linear-gradient(45deg, #FF5B7F 30%, #FC3A79 90%)',
                borderRadius: '25px',
                boxShadow: '0 3px 10px rgba(252, 58, 121, 0.3)',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF4B7F 30%, #FC2A79 90%)',
                  boxShadow: '0 4px 12px rgba(252, 58, 121, 0.4)',
                }
              }}
            >
              Filtros
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Grupos Musculares
              </Typography>
              <Divider />
              <MenuItem>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.upperBody}
                      onChange={() => handleFilterChange('upperBody')}
                      size="small"
                    />
                  }
                  label="Tren Superior"
                />
              </MenuItem>
              <MenuItem>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.lowerBody}
                      onChange={() => handleFilterChange('lowerBody')}
                      size="small"
                    />
                  }
                  label="Tren Inferior"
                />
              </MenuItem>
              <MenuItem>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.core}
                      onChange={() => handleFilterChange('core')}
                      size="small"
                    />
                  }
                  label="Core"
                />
              </MenuItem>
              <MenuItem>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.cardio}
                      onChange={() => handleFilterChange('cardio')}
                      size="small"
                    />
                  }
                  label="Cardio"
                />
              </MenuItem>
            </Menu>
          </Box>
          {filterExercises(ejercicios).map((ejercicio, ejIndex) => (
            <Box key={`exercise-${ejercicio.id || ejIndex}`}>
              {renderEjercicio(ejercicio)}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          No hay ejercicios en este periodo
        </Typography>
      )}
    </Box>
  );
};

export default PeriodoCard;