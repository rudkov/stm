import { Button, Form, Input } from 'antd';

import AuthLayout from './AuthLayout';
import { useCreateTeamMutation } from '../../api/accountApi';
import { useEffect } from 'react';

function CreateTeam() {
    const [form] = Form.useForm();    
    const [createTeam, { isLoading, error }] = useCreateTeamMutation();

    const onFinish = ({ name }) => {
        createTeam(name);
    };

    useEffect(()=> {
        if (error?.isValidationError) {
            form.setFields(error.fieldErrors);
        } else if (error) {
            console.log('Team creation failed. Please try again.');
        }
    }, [form, error]);

    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Let's Create Your Agency</h3>
            </AuthLayout.Header>
            <AuthLayout.Body>
                <Form
                    name='create-team'
                    form={form}
                    layout='vertical'
                    requiredMark={false}
                    size='large'
                    className='auth-form'
                    onFinish={onFinish}
                >
                    <Form.Item
                        name='name'
                        rules={[{ required: true, message: 'Please enter agency name' }]}
                    >
                        <Input placeholder='Agency name' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' block loading={isLoading}>
                            Create Agency
                        </Button>
                    </Form.Item>
                </Form>
            </AuthLayout.Body>
        </AuthLayout>
    );
}

export default CreateTeam;
