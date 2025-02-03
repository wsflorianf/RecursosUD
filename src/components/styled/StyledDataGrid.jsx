import { styled } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const StyledDataGrid = styled(DataGrid)(() => ({
  '&': {
    backgroundColor: '#fff'
  },
  '& .MuiDataGrid-cell':{
    padding: '10px 0',
    alignContent: 'center',
  },
  '& .theme-odd': {
    '&:hover': {
      backgroundColor: '#ccc'
    },
  },
  '& .theme-even': {
    backgroundColor: '#eee',
    '&:hover': {
      backgroundColor: '#ccc'
    },
  },

}));

export default StyledDataGrid
