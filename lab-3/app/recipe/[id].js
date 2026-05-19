import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]);
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

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

  // Extract ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.strMeal}</Text>
        <Text style={styles.category}>{recipe.strCategory} | {recipe.strArea}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((item, index) => (
            <Text key={index} style={styles.listItem}>• {item}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>{recipe.strInstructions}</Text>
        </View>
      </View>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#666',
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
  listItem: {
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 24,
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
