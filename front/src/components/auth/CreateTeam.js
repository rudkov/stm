import { Button, Form, Input } from 'antd';

import AuthLayout from 'components/auth/AuthLayout';
import BaseForm from 'components/auth/BaseForm';
import { useCreateTeamMutation } from 'api/accountApi';

function CreateTeam() {
    const [createTeam, result] = useCreateTeamMutation();

    const onFinish = ({ name }) => {
        createTeam(name);
    };

    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Let's Create Your Agency</h3>
            </AuthLayout.Header>
            <AuthLayout.Body>
                <BaseForm
                    name='create-team'
                    layout='vertical'
                    size='large'
                    className='auth-form'
                    result={result}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name='name'
                        rules={[{ required: true, message: 'Please enter agency name' }]}
                    >
                        <Input placeholder='Agency name' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' block loading={result.isLoading}>
                            Create Agency
                        </Button>
                    </Form.Item>
                </BaseForm>
            </AuthLayout.Body>
        </AuthLayout>
    );
}

export default CreateTeam;
