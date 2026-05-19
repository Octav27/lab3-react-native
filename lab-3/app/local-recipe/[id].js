import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRecipeById, deleteRecipe } from '../../db.js';

export default function LocalRecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(Number(id));
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching local recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(Number(id));
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete recipe.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {recipe.image ? (
          <Image source={{ uri: recipe.image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.bodyText}>{recipe.ingredients}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.bodyText}>{recipe.instructions}</Text>
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Recipe</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  content: {
    padding: 20,
    paddingBottom: 80, // space for delete button
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
