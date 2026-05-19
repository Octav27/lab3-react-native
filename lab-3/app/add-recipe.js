import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { insertRecipe } from '../db';

export default function AddRecipeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState('');

  const handleSave = async () => {
    if (!name.trim() || !ingredients.trim() || !instructions.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Ingredients, Instructions).');
      return;
    }

    try {
      await insertRecipe(name, ingredients, instructions, image);
      Alert.alert('Success', 'Recipe saved successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save recipe.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Recipe Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Pasta Bolognese"
      />

      <Text style={styles.label}>Ingredients *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="e.g. 500g pasta, 300g minced meat..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Instructions *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={instructions}
        onChangeText={setInstructions}
        placeholder="e.g. Boil water, add pasta..."
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Image URL (Optional)</Text>
      <TextInput
        style={styles.input}
        value={image}
        onChangeText={setImage}
        placeholder="https://example.com/image.jpg"
        autoCapitalize="none"
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Recipe</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
