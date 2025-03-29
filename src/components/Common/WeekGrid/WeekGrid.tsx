import React from 'react';
import { Box, Typography, Paper, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import { useWeekGrid } from '../../../contexts/WeekGridContext';
import { WeekDay, Period } from './types';

interface WeekDay {
  id: string;
  dayNumber: number;
}

interface WeekRange {
  start: number;
  end: number;
  name: string;
}

interface Period extends WeekRange {
  exercises?: any[];
}

interface WeekGridProps {
  weekDays?: WeekDay[];
  numberOfWeeks: number;
  selectedWeeks: Period[];
  onWeekSelect: (weekNumber: number) => void;
  selectionStart?: number | null;
  hoveredWeek: number | null;
  onHover?: (weekNumber: number | null) => void;
  getPreviewRange?: () => WeekRange | null;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.1),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(217, 70, 239, 0.2) 100%)',
  }
}));

const GridCell = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'isSelected' && 
    prop !== 'isPreview' && 
    prop !== 'background' &&
    prop !== 'isWeekend'
})<{ 
  isSelected?: boolean; 
  isPreview?: boolean; 
  background?: string;
  isWeekend?: boolean;
}>(({ theme, isSelected, isPreview, background, isWeekend }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  background: background || (
    isSelected 
      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
      : isPreview
        ? 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%)'
        : isWeekend
          ? alpha(theme.palette.primary.light, 0.02)
          : '#ffffff'
  ),
  border: '1px solid',
  borderColor: isSelected 
    ? '#6366f1'
    : isPreview
      ? '#a5b4fc'
      : alpha(theme.palette.divider, 0.08),
  boxShadow: isSelected || isPreview
    ? '0 12px 24px ' + alpha(theme.palette.primary.main, 0.2)
    : '0 4px 12px ' + alpha(theme.palette.primary.main, 0.05),

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.12), transparent 70%)',
    opacity: isSelected || isPreview ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  },

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 32px ' + alpha(theme.palette.primary.main, 0.15),
    borderColor: isSelected 
      ? '#6366f1'
      : isPreview
        ? '#a5b4fc'
        : theme.palette.primary.main,
    background: isSelected || isPreview
      ? undefined
      : alpha(theme.palette.primary.main, 0.02),

    '&::after': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
    opacity: 0,
    transform: 'translateY(4px)',
    transition: 'all 0.3s ease-in-out',
  },

  '& .day-number': {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: theme.spacing(0.5),
    color: isSelected || isPreview
      ? '#ffffff'
      : theme.palette.text.primary,
    textShadow: isSelected || isPreview
      ? '0 2px 4px rgba(0,0,0,0.1)'
      : 'none',
  },

  '& .week-label': {
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: isSelected || isPreview
      ? alpha('#ffffff', 0.9)
      : theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  }
}));

const WeekHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
  borderBottom: '1px solid',
  borderColor: alpha(theme.palette.divider, 0.08),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontWeight: 600,
  color: theme.palette.primary.main,
  position: 'relative',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.03), transparent 70%)',
  },

  '& .MuiSvgIcon-root': {
    fontSize: 18,
    color: alpha(theme.palette.primary.main, 0.7),
  },

  '& .MuiTypography-root': {
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
  }
}));

const WeekGrid: React.FC<WeekGridProps> = ({
  weekDays,
  numberOfWeeks,
  selectedWeeks,
  onWeekSelect,
  selectionStart,
  hoveredWeek,
  onHover,
  getPreviewRange
}) => {
  const theme = useTheme();

  const isNumberSelected = (number: number) => {
    return selectedWeeks.some(range => 
      number >= range.start && number <= range.end
    );
  };

  const isNumberInPreview = (number: number) => {
    if (!selectionStart || !hoveredWeek) return false;
    const previewRange = getPreviewRange();
    if (!previewRange) return false;
    return number >= previewRange.start && number <= previewRange.end;
  };

  const getPeriodColor = (number: number) => {
    const period = selectedWeeks.find(range => 
      number >= range.start && number <= range.end
    );
    if (period) {
      const index = selectedWeeks.indexOf(period);
      const colors = [
        'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      ];
      return colors[index % colors.length];
    }
    return undefined;
  };

  const { selectedWeeks, weekDays: contextWeekDays } = useWeekGrid();
  
  const isWeekend = (dayNumber: number) => {
    const dayOfWeek = dayNumber % 7;
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Generate week numbers array based on numberOfWeeks
  const weekNumbers = Array.from({ length: numberOfWeeks }, (_, i) => i + 1);

  return (
    <StyledPaper elevation={0}>
      <Box sx={{ 
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: alpha(theme.palette.primary.main, 0.05),
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.primary.main, 0.2),
          borderRadius: '4px',
          '&:hover': {
            background: alpha(theme.palette.primary.main, 0.3),
          },
        },
      }}>
        <Box sx={{ minWidth: 800, p: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'auto repeat(7, 1fr)', 
            gap: 2.5,
            animation: 'fadeIn 0.5s ease-out',
            '@keyframes fadeIn': {
              from: {
                opacity: 0,
                transform: 'translateY(10px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}>
            {/* Header */}
            <WeekHeader>
              <EventIcon />
              <Typography>Semana</Typography>
            </WeekHeader>
            {Array.from({ length: 7 }, (_, i) => (
              <WeekHeader key={i}>
                <CalendarTodayIcon />
                <Typography>Día {i + 1}</Typography>
              </WeekHeader>
            ))}

            {/* Grid */}
            {weekNumbers.map((weekNumber, weekIndex) => (
              <React.Fragment key={weekNumber}>
                <Box sx={{ 
                  p: 2.5, 
                  fontWeight: 700,
                  background: alpha(theme.palette.primary.main, 0.03),
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.primary.main,
                  gap: 1,
                  boxShadow: `inset 0 2px 4px ${alpha(theme.palette.primary.main, 0.05)}`,
                  animation: `slideIn 0.5s ease-out ${weekIndex * 0.1}s both`,
                  '@keyframes slideIn': {
                    from: {
                      opacity: 0,
                      transform: 'translateX(-10px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                }}>
                  <EventIcon sx={{ fontSize: 20 }} />
                  {weekNumber}
                </Box>
                {effectiveWeekDays
                  .filter(day => Math.ceil(day.dayNumber / 7) === weekNumber)
                  .map((day, dayIndex) => (
                    <GridCell
                      key={day.id}
                      isSelected={isNumberSelected(day.dayNumber)}
                      isPreview={isNumberInPreview(day.dayNumber)}
                      isWeekend={isWeekend(day.dayNumber)}
                      background={getPeriodColor(day.dayNumber)}
                      onClick={() => onWeekSelect(day.dayNumber)}
                      onMouseEnter={() => onHover && onHover(day.dayNumber)}
                      onMouseLeave={() => onHover && onHover(null)}
                      sx={{
                        animation: `fadeIn 0.5s ease-out ${(weekIndex * 7 + dayIndex) * 0.05}s both`,
                      }}
                    >
                      <Typography className="day-number">
                        {day.dayNumber}
                      </Typography>
                      <Typography className="week-label">
                        <EventIcon sx={{ fontSize: 16 }} />
                        Semana {weekNumber}
                      </Typography>
                    </GridCell>
                  ))}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default WeekGrid;