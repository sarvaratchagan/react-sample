import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { Link } from 'react-router-dom';

import { Form, Button, FormControlProps } from 'react-bootstrap';
import { actions as authActions } from 'app/service/auth';

interface LoginComponentProps {
    login: (username: string, password: string) => boolean;
}

interface LoginComponentState {
    username?: string;
    password?: string;
    keepMeSignedIn?: boolean;
    formErrors?: any;
    valid?: boolean;
}

class Login extends React.Component<LoginComponentProps, LoginComponentState> {
    public constructor(props: LoginComponentProps) {
        super(props);
        this.state = {
            username: '',
            password: '',
            keepMeSignedIn: false,
            formErrors: {
                username: false,
                password: false,
            },
            valid: false,
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onBlurHandler = this.onBlurHandler.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.validateField = this.validateField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    private handleSubmit(event: React.FormEvent<FormControlProps>) {
        const { username, password } = this.state;
        if (!this.validateForm()) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.props.login(username, password);
        event.preventDefault();
        event.stopPropagation();
    }

    private onChangeHandler(event: React.FormEvent<FormControlProps>) {
        const control = event.target as any;
        this.setState({ [control.id]: control.value });
        this.validateField(control.id, control.value);
    }

    private onBlurHandler(event: React.FormEvent<HTMLInputElement>) {
        const control = event.target as any;
        this.setState({ formErrors: { [control.id]: control.value } });
        this.validateField(control.id, control.value);
    }

    private validateField(fieldName: string, value: string) {
        const formErrors = this.state.formErrors || {};
        let re = null;
        switch (fieldName) {
            case 'username':
                re = new RegExp('^\\S{6,}$');
                formErrors.username = !re.test(value || '');
                break;
            case 'password':
                re = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
                formErrors.password = !re.test(value || '');
                break;
            default:
                break;
        }
        this.setState({ formErrors, valid: this.validateForm() });
    }

    private validateForm(): boolean {
        const formErrors = this.state.formErrors || {};
        return formErrors.username !== true && formErrors.password !== true;
    }

    public render() {
        const { username, password, valid } = this.state;
        const formErrors = this.state.formErrors || {};
        return (
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-lg-8 col-sm-12 col-md-12 mx-auto">
                    <img
                        className="img-fluid"
                        src={require('../../../assets/images/17545-hero-mass-senior-couple-seafront-930x400.jpg')}
                    />
                </div>
                <div className="col-lg-4 col-sm-12 col-md-12 mx-auto">
                    <div className="card">
                        <div className="card-header">Login</div>
                        <div className="card-body">
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        isValid={false}
                                        value={username}
                                        onBlur={this.onBlurHandler}
                                        onChange={this.onChangeHandler}
                                    />
                                    <Form.Text
                                        className={
                                            formErrors.username === true
                                                ? 'text-muted has-error'
                                                : 'd-none'
                                        }
                                    >
                                        User name must be at least 6 characters.
                                        White space not allowed.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onBlur={this.onBlurHandler}
                                        onChange={this.onChangeHandler}
                                    />
                                    <Form.Text
                                        className={
                                            formErrors.password === true
                                                ? 'text-muted has-error'
                                                : 'd-none'
                                        }
                                    >
                                        Password must be more than 8 characters,
                                        at least one small letter, one capital
                                        letter and one number
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="keepMeSignedIn">
                                    <Form.Check
                                        type="checkbox"
                                        label="Keep me signed in"
                                    />
                                </Form.Group>

                                <div className="d-flex flex-row">
                                    <div className="col-6">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="w-100"
                                            disabled={!valid}
                                        >
                                            Submit
                                        </Button>
                                    </div>

                                    <div className="col-6">
                                        <Link
                                            to="/register"
                                            className="btn btn-primary w-100"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
    login: (username: string, password: string): boolean => {
        if (!username || !password) {
            // invalid form
            return false;
        }
        dispatch(authActions.login({ username, password }));
        return true;
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
