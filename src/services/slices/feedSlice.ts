import { getFeedsApi, getOrderByNumberApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TOrder, TFeedState, TOrdersData } from '@/utils/types';

export const fetchFeeds = createAsyncThunk<TOrdersData, void, { rejectValue: string }>(
  'feed/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('feed/fetchOrderByNumber', async (number: number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    if (response.success && response.orders.length > 0) {
      return response.orders[0];
    }
    return rejectWithValue('Заказ не найден');
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

type TFeedSliceState = TFeedState & {
  currentOrder: TOrder | null;
  isOrderLoading: boolean;
  orderError: string | null;
};

const initialState: TFeedSliceState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  currentOrder: null,
  isOrderLoading: false,
  orderError: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.currentOrder = null;
      state.orderError = null;
      state.isOrderLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки ленты';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = action.payload ?? 'Ошибка загрузки заказа';
      });
  },
});

export default feedSlice.reducer;
export const { clearOrderState } = feedSlice.actions;
