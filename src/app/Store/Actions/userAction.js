import { API_URL, getAuthHeaders } from "@/app/utils/apiUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async ( _,{ rejectWithValue }) => {
      
      try {
      //   const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${API_URL}/user/`, getAuthHeaders());
      
        return response.data.user; // The API response (leagues and teams)
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );