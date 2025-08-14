import httpStatus from "http-status-codes";
import AppError from "../../error-helpers/app-error";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
	const isDivisionExist = await Division.findOne({ name: payload.name });
	if (isDivisionExist) {
		throw new AppError(httpStatus.CONFLICT, "A division with this name is already exist. Try with the new one.");
	}
	const newDivision = await Division.create(payload);
	return newDivision;
};

const getAllDivision = async () => {
	const divisions = await Division.find({});
	const totalDivisions = await Division.countDocuments();
	return {
		total: totalDivisions,
		data: divisions,
	};
};

const updateDivision = async (divisionId: string, payload: Partial<IDivision>) => {
	const isDivisionExist = await Division.findById(divisionId);
	if (!isDivisionExist) {
		throw new AppError(httpStatus.NOT_FOUND, "Division Not Found!");
	}

	const duplicateDivision = await Division.findOne({
		name: payload.name,
		_id: { $ne: divisionId },
	});

	if (duplicateDivision) {
		throw new AppError(httpStatus.CONFLICT, "This division is already exist!. Try with a new one.");
	}

	const UpdatedDivision = await Division.findByIdAndUpdate(divisionId, payload, { new: true, runValidators: true });
	return UpdatedDivision;
};

const getDivisionById = async (divisionId: string) => {
	const isDivisionExist = await Division.findById(divisionId);
	if (!isDivisionExist) {
		throw new AppError(httpStatus.NOT_FOUND, "Division Not Found!");
	}

	return {
		data: isDivisionExist,
	};
};

const deleteDivision = async (divisionId: string) => {
	const isDivisionExist = await Division.findById(divisionId);
	if (!isDivisionExist) {
		throw new AppError(httpStatus.NOT_FOUND, "Division Not Found!");
	}

	await Division.findByIdAndDelete(divisionId);
	return null;
};

export const DivisionServices = {
	createDivision,
	updateDivision,
	getAllDivision,
	getDivisionById,
	deleteDivision,
};
