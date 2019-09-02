import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Button, FormControlProps } from 'react-bootstrap';
import { Action, Dispatch } from 'redux';
import { actions as authActions } from 'app/service/auth';

interface AccountComponentProps {
    register: (user: any) => void;
}

interface AccountComponentState {
    user?: {
        firstName?: string;
        lastName?: string;
        username?: string;
        password?: string;
    };
    formErrors?: any;
    submitted: boolean;
    valid: boolean;
}

class Account extends React.Component<
    AccountComponentProps,
    AccountComponentState
> {
    public constructor(props: AccountComponentProps) {
        super(props);
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                username: '',
                password: '',
            },
            formErrors: {
                firstName: '',
                lastName: '',
                username: '',
                password: '',
            },
            submitted: false,
            valid: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateField = this.validateField.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onBlurHandler = this.onBlurHandler.bind(this);
        this.validateField = this.validateField.bind(this);
    }

    private handleSubmit(event: React.FormEvent<FormControlProps>) {
        const { user } = this.state;
        if (!this.validateForm()) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.setState({ submitted: true });
        this.props.register(user);
    }

    private onChangeHandler(event: React.FormEvent<FormControlProps>) {
        const control = event.target as any;
        const { user } = this.state;
        this.setState({ user: { ...user, [control.id]: control.value } });
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
            case 'firstName':
                re = new RegExp('(^$)|(\\s+$)');
                formErrors.firstName = re.test(value || '');
                break;
            case 'lastName':
                re = new RegExp('(^$)|(\\s+$)');
                formErrors.lastName = re.test(value || '');
                break;
            case 'username':
                re = new RegExp('^\\S{6,}$');
                formErrors.username = !re.test(value || '');
                break;
            case 'password':
                re = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
                formErrors.password = !re.test(value || '');
                break;
        }
        this.setState({ formErrors, valid: this.validateForm() });
    }

    private validateForm(): boolean {
        const formErrors = this.state.formErrors || {};
        return (
            formErrors.username !== true &&
            formErrors.password !== true &&
            formErrors.firstName !== true &&
            formErrors.lastName !== true
        );
    }

    public render() {
        const { user, formErrors, valid } = this.state;
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
                        <div className="card-header">Registration</div>
                        <div className="card-body">
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="firstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user.firstName}
                                        onBlur={this.onBlurHandler}
                                        onChange={(
                                            event: React.FormEvent<
                                                FormControlProps
                                            >,
                                        ) => this.onChangeHandler(event)}
                                    />
                                    <Form.Text
                                        className={
                                            formErrors.firstName === true
                                                ? 'text-muted has-error'
                                                : 'd-none'
                                        }
                                    >
                                        First name is required
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="lastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user.lastName}
                                        onBlur={this.onBlurHandler}
                                        onChange={(
                                            event: React.FormEvent<
                                                FormControlProps
                                            >,
                                        ) => this.onChangeHandler(event)}
                                    />
                                    <Form.Text
                                        className={
                                            formErrors.lastName === true
                                                ? 'text-muted has-error'
                                                : 'd-none'
                                        }
                                    >
                                        Last name is required
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        isValid={false}
                                        value={user.username}
                                        onBlur={this.onBlurHandler}
                                        onChange={(
                                            event: React.FormEvent<
                                                FormControlProps
                                            >,
                                        ) => this.onChangeHandler(event)}
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
                                        value={user.password}
                                        onBlur={this.onBlurHandler}
                                        onChange={(
                                            event: React.FormEvent<
                                                FormControlProps
                                            >,
                                        ) => this.onChangeHandler(event)}
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
                                            to="/login"
                                            className="btn btn-danger w-100"
                                        >
                                            Cancel
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
    register: (user: any): boolean => {
        dispatch(authActions.register(user));
        return true;
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Account);
