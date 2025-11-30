import * as FormPrimitive from "formsnap";
import Description from "./form-description.svelte";
import Label from "./form-label.svelte";
import FieldErrors from "./form-field-errors.svelte";
import Field from "./form-field.svelte";
import TextField from "./form-text-field.svelte";
import DateTimeField from "./form-date-time-field.svelte";
import FileField from "./form-file-field.svelte";
import ImagesField from "./form-images-field.svelte";
import LocationField from "./form-location-field.svelte";
import Fieldset from "./form-fieldset.svelte";
import Legend from "./form-legend.svelte";
import ElementField from "./form-element-field.svelte";
import Button from "./form-button.svelte";

const Control = FormPrimitive.Control;

export {
	Field,
	TextField,
	DateTimeField,
	FileField,
	ImagesField,
	LocationField,
	Control,
	Label,
	Button,
	FieldErrors,
	Description,
	Fieldset,
	Legend,
	ElementField,
	//
	Field as FormField,
	TextField as FormTextField,
	DateTimeField as FormDateTimeField,
	FileField as FormFileField,
	ImagesField as FormImagesField,
	LocationField as FormLocationField,
	Control as FormControl,
	Description as FormDescription,
	Label as FormLabel,
	FieldErrors as FormFieldErrors,
	Fieldset as FormFieldset,
	Legend as FormLegend,
	ElementField as FormElementField,
	Button as FormButton,
};
