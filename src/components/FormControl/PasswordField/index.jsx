/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

PasswordField.propTypes = {

};

function PasswordField({ form, name, label }) {
    const { formState } = form;
    const { errors } = formState;
    const hasError = errors[name];
    return (
        <div>
            <Controller
                control={form.control}
                name={name}
                render={({
                    field: { onChange, onBlur, name, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                    formState,
                }) => (
                    <TextField
                        onBlur={onBlur} // notify when input is touched
                        onChange={onChange} // send value to hook form
                        fullWidth
                        variant="outlined"
                        label={label}
                        id={name}
                        margin='normal'
                        type='password'
                        error={!!hasError}
                        helperText={errors[name]?.message}
                    />
                )}
            />
        </div>
    );
}

export default PasswordField;