import { Button, Form, Input } from 'antd';

import AuthLayout from './AuthLayout';

function CreateTeam() {
    const [form] = Form.useForm();

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
                >
                    <Form.Item
                        name='name'
                        rules={[{ required: true, message: 'Please enter agency name' }]}
                    >
                        <Input placeholder='Agency name' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' block>Create Agency</Button>
                    </Form.Item>
                </Form>
            </AuthLayout.Body>
        </AuthLayout>
    );
}

export default CreateTeam;
