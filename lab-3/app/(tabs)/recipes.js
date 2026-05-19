import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function RecipesScreen() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch initial recipes or perform search
  const fetchRecipes = async (searchQuery = '') => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes('chicken'); // Default search
  }, []);

  const handleSearch = () => {
    fetchRecipes(query);
  };

  const renderRecipe = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/recipe/${item.idMeal}`)}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.strMeal}</Text>
        <Text style={styles.category}>{item.strCategory}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderRecipe}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No recipes found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#fafafa',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#666',
  },
});
