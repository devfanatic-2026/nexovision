import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFloatForm } from '@float.js/lite/hooks/use-form';
import { api } from '../services/api';
import { navigationActions, useNavigationStore } from '../store/navigation';
import { useEffect, useState } from 'react';

export default function UserForm() {
    const { params } = useNavigationStore();
    const { goHome, goBack } = navigationActions;
    const isEdit = !!params.id;
    const [loading, setLoading] = useState(false);

    const form = useFloatForm({
        initialValues: {
            name: '',
            email: '',
            role: 'user',
            status: 'offline'
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (isEdit) {
                    await api.users.update(params.id, values);
                    Alert.alert('Success', 'User updated successfully');
                } else {
                    await api.users.create({
                        ...values,
                        avatar: `https://i.pravatar.cc/150?u=${values.email}`, // Dummy avatar
                        createdAt: new Date().toISOString()
                    });
                    Alert.alert('Success', 'User created successfully');
                }
                goBack();
            } catch (e) {
                Alert.alert('Error', 'Failed to save user');
            } finally {
                setLoading(false);
            }
        }
    });

    useEffect(() => {
        if (isEdit) {
            loadUser();
        }
    }, [isEdit]);

    const loadUser = async () => {
        setLoading(true);
        try {
            const user = await api.users.getById(params.id);
            if (user) {
                form.reset(user);
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to load user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-row items-center p-4 border-b border-gray-200">
                <TouchableOpacity onPress={goBack}>
                    <Text className="text-blue-500 font-medium">Cancel</Text>
                </TouchableOpacity>
                <Text className="font-bold text-lg ml-4 flex-1 text-center">
                    {isEdit ? 'Edit User' : 'New User'}
                </Text>
                <TouchableOpacity onPress={form.handleSubmit} disabled={loading}>
                    <Text className={`font-bold ${loading ? 'text-gray-400' : 'text-blue-500'}`}>
                        {loading ? 'Saving...' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="p-4">
                <Text className="text-sm font-bold text-gray-700 mb-1">Name</Text>
                <TextInput
                    className="border border-gray-300 rounded p-2 mb-4"
                    value={form.values.name}
                    onChangeText={(text) => form.setValue('name', text)}
                    placeholder="John Doe"
                />

                <Text className="text-sm font-bold text-gray-700 mb-1">Email</Text>
                <TextInput
                    className="border border-gray-300 rounded p-2 mb-4"
                    value={form.values.email}
                    onChangeText={(text) => form.setValue('email', text)}
                    placeholder="john@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text className="text-sm font-bold text-gray-700 mb-1">Role</Text>
                <View className="flex-row mb-4">
                    {['user', 'admin', 'moderator'].map((role) => (
                        <TouchableOpacity
                            key={role}
                            className={`mr-2 px-3 py-1 rounded-full border ${form.values.role === role
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-white border-gray-300'
                                }`}
                            onPress={() => form.setValue('role', role)}
                        >
                            <Text className={form.values.role === role ? 'text-white' : 'text-gray-700'}>
                                {role}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Debug Info */}
                <View className="mt-8 p-4 bg-gray-100 rounded">
                    <Text className="text-xs text-gray-500 font-mono">
                        Form State: {JSON.stringify(form.values, null, 2)}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
