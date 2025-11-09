import { createAsyncThunk } from "@reduxjs/toolkit";

type asyncThunkProps<T = any> = {
	type: string;
	action: (data: T) => Promise<
		| {
				code: number;
				data: any;
				message?: undefined;
		  }
		| {
				code: number;
				message: string;
				data?: undefined;
		  }
	>;
};

export const commonCreateAsyncThunk = <T = any>(props: asyncThunkProps<T>) => {
	return createAsyncThunk(props.type, async (data: T, { rejectWithValue }) => {
		try {
			const response = await props.action(data);
			return response;
		} catch (err: any) {
			return rejectWithValue(err);
		}
	});
};
