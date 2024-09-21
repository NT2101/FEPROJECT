/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form'
InputField.propTypes = {

};

function InputField({ form, name, defaultValue, label, disabled, visiable, readonly, rows, multiline }) {
    const { formState } = form;
    const { errors } = formState;
    const hasError = errors[name];

    return (
        <div>
            <Controller
                control={form.control}
                name={name}
                render={({
                    field: { onChange, onBlur, name, value },
                }) => (
                    <TextField
                        onBlur={onBlur} // notify when input is touched
                        onChange={onChange} // send value to hook form
                        fullWidth
                        variant="outlined"
                        label={label}
                        id={name}
                        error={!!hasError}
                        helperText={errors[name]?.message}
                        margin='normal'
                        value={value}
                        disabled={disabled}
                        rows={rows}
                        visiable={visiable}
                        multiline={multiline}
                        defaultValue={defaultValue}
                        InputProps={{
                            readOnly: readonly // Sử dụng prop readonly được truyền vào từ component gốc
                        }}
                    />
                )}
            />
        </div>
    );
}

export default InputField;