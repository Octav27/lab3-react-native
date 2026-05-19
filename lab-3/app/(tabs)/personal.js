import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getAllRecipes } from '../../db';

export default function PersonalRecipesScreen() {
  const [recipes, setRecipes] = useState([]);
  const router = useRouter();

  const fetchRecipes = async () => {
    const data = await getAllRecipes();
    setRecipes(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const renderRecipe = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/local-recipe/${item.id}`)}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipe}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't saved any recipes yet.</Text>
          </View>
        }
      />
      
      <Pressable 
        style={styles.fab} 
        onPress={() => router.push('/add-recipe')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
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
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    lineHeight: 34,
  },
});
