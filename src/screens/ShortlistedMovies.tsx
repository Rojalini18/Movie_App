import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {removeMovie} from '../redux/shortlistedMovies';
import Modal from 'react-native-modal';

const ShortlistedMovies = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const dispatch = useDispatch();

  const shortlistedMovies = useSelector(
    (state: any) => state.shortlistedMovies.movies,
  );

  const openModal = (movie: any) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  const handleRemoveFromShortlist = () => {
    if (selectedMovie) {
      dispatch(removeMovie(selectedMovie));
    }
    closeModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shortlisted Movies 🎥</Text>
      {shortlistedMovies.length === 0 ? (
        <Text style={styles.emptyText}>No movies shortlisted yet.</Text>
      ) : (
        <FlatList
          data={shortlistedMovies}
          keyExtractor={item => item.imdbID}
          renderItem={({item}) => (
            <View style={styles.listContainer}>
              <Image source={{uri: item.Poster}} style={styles.image} />
              <View style={styles.detailsContainer}>
                <Text style={styles.title}>{item.Title}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => openModal(item)}
                  activeOpacity={0.7}>
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Remove Movie</Text>
          <Text style={styles.modalText}>
            Are you sure you want to remove "{selectedMovie?.Title}"?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.yesButton}
              onPress={handleRemoveFromShortlist}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#ff6b81',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  yesButton: {
    backgroundColor: '#ff6b81',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default ShortlistedMovies;
