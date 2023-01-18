import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food, { FoodProps } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isEditingFoodModalOpen, setIsEditingFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodProps>({} as FoodProps);

  useEffect(() => {
    api.get<FoodProps[]>('/foods')
      .then(response => {
        // console.log(response.data);
        setFoods(response.data);
      });
  }, []);

  const handleEditFood = (food: FoodProps) => {
    setIsEditingFoodModalOpen(true);
    // console.log(food);
    setEditingFood(food);
  };

  async function handleDeleteFood(id: number) {
    try {
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter((food) => food.id !== id);

      setFoods(foodsFiltered);
    } catch (error) {
      // console.log("Id n econtrado");
      console.error(error);
    }
  }

  const toggleAddFoodModal = () => {
    setIsAddFoodModalOpen(!isAddFoodModalOpen);
  }


  function toggleEditingFoodModal() {
    setIsEditingFoodModalOpen(!isEditingFoodModalOpen);
  }

  async function handleAddFood(food: FoodProps) {
    try {
      if (!(food.description && food.price && food.name && food.image)) {
        throw Error("Dados inválidos");
      }
      const response = await api.post('/foods', {
        ...food,
        available: true
      });
      setFoods(prevState => [...prevState, response.data]);
    }
    catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateFood(food: FoodProps) {
    try {
      const { data: updatedFood } = await api.put<FoodProps>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food }
      );
      const updatedFoods = foods.map((f) => (f.id !== updatedFood.id ? f : updatedFood));
      setFoods(updatedFoods);
      // console.log(foods, updatedFoods, updatedFood)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <ModalAddFood
        isOpen={isAddFoodModalOpen}
        setIsOpen={toggleAddFoodModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditingFoodModalOpen}
        setIsOpen={toggleEditingFoodModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />
      <Header openModal={toggleAddFoodModal} />
      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>

  );
}

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       foods: [],
//       editingFood: {},
//       modalOpen: false,
//       editModalOpen: false,
//     }
//   }

//   async componentDidMount() {
//     const response = await api.get('/foods');

//     this.setState({ foods: response.data });
//   }

//   handleAddFood = async food => {
//     const { foods } = this.state;

//     try {
//       const response = await api.post('/foods', {
//         ...food,
//         available: true,
//       });

//       this.setState({ foods: [...foods, response.data] });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   handleUpdateFood = async food => {
//     const { foods, editingFood } = this.state;

//     try {
//       const foodUpdated = await api.put(
//         `/foods/${editingFood.id}`,
//         { ...editingFood, ...food },
//       );

//       const foodsUpdated = foods.map(f =>
//         f.id !== foodUpdated.data.id ? f : foodUpdated.data,
//       );

//       this.setState({ foods: foodsUpdated });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   handleDeleteFood = async id => {
//     const { foods } = this.state;

//     await api.delete(`/foods/${id}`);

//     const foodsFiltered = foods.filter(food => food.id !== id);

//     this.setState({ foods: foodsFiltered });
//   }

//   toggleModal = () => {
//     const { modalOpen } = this.state;

//     this.setState({ modalOpen: !modalOpen });
//   }

//   toggleEditModal = () => {
//     const { editModalOpen } = this.state;

//     this.setState({ editModalOpen: !editModalOpen });
//   }

//   handleEditFood = food => {
//     this.setState({ editingFood: food, editModalOpen: true });
//   }

//   render() {
//     const { modalOpen, editModalOpen, editingFood, foods } = this.state;

//     return (
//       <>
//         <Header openModal={this.toggleModal} />
//         <ModalAddFood
//           isOpen={modalOpen}
//           setIsOpen={this.toggleModal}
//           handleAddFood={this.handleAddFood}
//         />
//         <ModalEditFood
//           isOpen={editModalOpen}
//           setIsOpen={this.toggleEditModal}
//           editingFood={editingFood}
//           handleUpdateFood={this.handleUpdateFood}
//         />

//         <FoodsContainer data-testid="foods-list">
//           {foods &&
//             foods.map(food => (
//               <Food
//                 key={food.id}
//                 food={food}
//                 handleDelete={this.handleDeleteFood}
//                 handleEditFood={this.handleEditFood}
//               />
//             ))}
//         </FoodsContainer>
//       </>
//     );
//   }
// };

export default Dashboard;
