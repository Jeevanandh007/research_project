import React from 'react';
import { Modal, Form, Input, Button, message, Select } from 'antd';
import { CreateUserForm } from '../types';
import { useCreateUser } from '../hooks/use-create-user';
import { AxiosError } from 'axios';

interface CreateUserModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isVisible, onClose }: CreateUserModalProps) {
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();

  const [form] = Form.useForm();

  const handleSubmit = async (values: CreateUserForm) => {
    try {
      await createUser(values);
      form.resetFields();
      message.success('User created successfully');
      onClose();
    } catch (error) {
      let errorMessage = 'Failed to create user';

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      message.error(errorMessage);
    }
  };

  return (
    <Modal
      title="Create User"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ role: 'user' }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select role!' }]}
        >
          <Select>
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isCreating} block>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
