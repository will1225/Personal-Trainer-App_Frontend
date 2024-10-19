import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Image, TouchableOpacity } from "react-native";
import { CustomButton} from "@/components";
import { Href, router, useLocalSearchParams } from "expo-router";
import { getDailyRoutine, saveDailyRoutine } from "./controllers/dailyRoutine";
import { getOneExercise } from "./controllers/dailyRoutine";
import RefreshButton from '../components/RefreshButton'; 
import VideoRefreshButton from '../components/VideoRefreshButton'; 
import { fetchVideoData } from "./controllers/generateRoutine";
import { Level, RequiredEquipment, WorkoutEnv, MuscleGroupProps, SaveRoutine} from "../types"
import Modal from "react-native-modal";
import { useQuery, useQueryClient } from "react-query";
import YoutubePlayer from 'react-native-youtube-iframe';

type ExerciseDetail = {
  exerciseDetailId: number;
  exerciseId: number;
  exerciseName: string;
  sets: number;
  reps: number;
  youtubeURL: string;
  thumbnailURL: string;
  level: Level;
  requiredEquip: RequiredEquipment;
  workoutEnvs: WorkoutEnv[];
  muscleGroups: MuscleGroupProps[];
};


// Daily Routine Detail Page
const dailyRoutineDetail = () => {
  const params = useLocalSearchParams();
  const dailyRoutineId = params.dailyRoutineId ? Number(params.dailyRoutineId): 0;
  const dayName = params.dayName
  const queryClient = useQueryClient();

  const [isSubmitting, setSubmitting] = useState(false);
  const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetail[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ExerciseDetail>();
  const [showVideoModal, setShowVideoModel] = useState(false);

  //const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");

  const fetchData = async (dailyRoutineId: number) => {
    if (!dailyRoutineId) {
        console.log("No dailyRoutineId provided");
        return [];
    }

    try {
        const response = await getDailyRoutine(dailyRoutineId);
        if (!response || response.length === 0) {
            console.log("Empty Data Received");
            return [];
        }

        // Process the response and create the ExerciseDetail objects
        const details = response.map((detail: any) => {
            const level: Level = {
                id: Number(detail.exercise.level.id),
                description: detail.exercise.level.description
            };

            const equip: RequiredEquipment = {
                id: Number(detail.exercise.requiredEquipment.id),
                description: detail.exercise.requiredEquipment.description
            };

            const workoutEnvs: WorkoutEnv[] = detail.exercise.workoutEnvironments.map((e: any) => ({
                id: Number(e.workoutEnvironment.id),
                description: e.workoutEnvironment.description,
            }));

            const muscleGroups: MuscleGroupProps[] = detail.exercise.muscleGroups.map((w: any) => ({
                id: Number(w.muscleGroup.id),
                description: w.muscleGroup.description
            }));

            return {
                exerciseDetailId: Number(detail.id),
                exerciseId: Number(detail.exercise.id),
                exerciseName: detail.exercise.name,
                sets: Number(detail.sets),
                reps: Number(detail.reps),
                youtubeURL: detail.youtubeURL,
                thumbnailURL: detail.thumbnailURL,
                level,
                requiredEquip: equip,
                workoutEnvs,
                muscleGroups,
            };
        });

        return details; // Return the array of ExerciseDetail objects

    } catch (error) {
        console.error("Error fetching Daily Routine", error);
        return []; // Return an empty array on error
    }
};

// Fetch data using useQuery
const { isLoading, isFetching, data } = useQuery(
    ['dailyRoutineDetail', dailyRoutineId],
    () => fetchData(dailyRoutineId),
    {
        enabled: !!dailyRoutineId, // Only fetch if dailyRoutineId is valid
        refetchOnWindowFocus: false,
        onSuccess: (fetchedData) => {
            setExerciseDetails(fetchedData); // Set new exercise details on successful fetch
        }
    }
);
  

  const refreshExercise = async (exerciseDetailId: number) => {

    if (exerciseDetailId == 0) {
        console.log("Refresh Exercise Button Pressed");
        return;
    }

    try {
        const detail = exerciseDetails.find(detail => detail.exerciseDetailId === exerciseDetailId);

        if (!detail) {
            throw new Error(`Exercise detail with id ${exerciseDetailId} not found`);
        }

        const muscleGroupIds = detail?.muscleGroups.map(muscle => muscle.id)
        
        const newExercise = await getOneExercise(
            undefined,
            undefined,
            undefined,
            detail.level.id,
            undefined,
            detail.workoutEnvs[0].id,
            muscleGroupIds
        )

        const level: Level = {
            id: Number(newExercise.level.id),
            description: newExercise.level.description
        }

        const equip: RequiredEquipment = {
            id: Number(newExercise.requiredEquipment.id),
            description: newExercise.requiredEquipment.description
        }

        const newWorkoutEnv: WorkoutEnv[] = [];

        newExercise.workoutEnvironments.forEach((e: any) => {
            const newEnv = {
                id: Number(e.workoutEnvironment.id),
                description: e.workoutEnvironment.description,
            }
            newWorkoutEnv.push(newEnv);
        })

        const newMuscleGroup: MuscleGroupProps[] = [];

        newExercise.muscleGroups.forEach((w: any) => {
            const newEnv = {
                id: Number(w.muscleGroup.id),
                description: w.muscleGroup.description
            }
            newMuscleGroup.push(newEnv);
        })

        
        const newExerciseDetail: ExerciseDetail = {
            exerciseDetailId: exerciseDetailId,
            exerciseId: Number(newExercise.id),
            exerciseName: newExercise.name,
            sets: Number(newExercise.defaultSets),
            reps: Number(newExercise.defaultReps),
            youtubeURL: newExercise.videos[0].url,
            thumbnailURL: newExercise.videos[0].thumbnail,
            level: level,
            requiredEquip: equip,
            workoutEnvs: newWorkoutEnv,
            muscleGroups: newMuscleGroup
        };

        setExerciseDetails(prevDetails =>
            prevDetails.map(d =>
            d.exerciseDetailId === newExerciseDetail.exerciseDetailId ? newExerciseDetail : d
            )
        );
            console.log("Refresh Exercise Pressed");
        setIsChanged(true);
    } catch (err) {
        console.log("Error: ", err);
    }
  }

  const refreshVideo = async (exerciseId: number) => {

    const videoData = await fetchVideoData(exerciseId);
    if (!videoData || videoData.length === 0) {
        console.log("No video data found for this exercise");
        return;
    }

    // Extract the new video URL and thumbnail from the fetched video data
    const newVideoURL = videoData.data.url;
    const newThumbnailURL = videoData.data.thumbnail;

    // Update only the youtubeURL and thumbnailURL in the state
    setExerciseDetails(prevDetails =>
        prevDetails.map(detail =>
            detail.exerciseId === exerciseId
                ? {
                      ...detail,                // Spread the existing details
                      youtubeURL: newVideoURL,   // Update youtubeURL
                      thumbnailURL: newThumbnailURL // Update thumbnailURL
                  }
                : detail // If not the same exerciseDetailId, leave unchanged
        )
    );
    setIsChanged(true);
    console.log("Refresh Video Pressed");
  }

  const handleSaveRoutine = async() => {
    try {
        setSubmitting(true);

        const data: SaveRoutine[] = [];

        exerciseDetails.forEach(detail => {
            const dailyRoutineData = {
                exerciseDetailId: detail.exerciseDetailId,
                sets: detail.sets,
                reps: detail.reps,
                youtubeURL: detail.youtubeURL,
                thumbnailURL: detail.thumbnailURL,
                dailyRoutineId: dailyRoutineId,
                exerciseId: detail.exerciseId
            }

            data.push(dailyRoutineData);
        })
        
        // API call
        const result = await saveDailyRoutine(data);

        if (result) {
            Alert.alert("Success", "Daily Routine saved successfully!");
            //with this, it causes duplicate key error **/
            await queryClient.invalidateQueries(['dailyRoutineDetail', dailyRoutineId]); 
            //** *********************** **/
            router.push("/(tabs)/three" as Href<string>);
        } else {
            Alert.alert("Update Daily Routine Failed");
        }

      } catch (error) {
        console.error("Error saving routine:", error);
        Alert.alert("Error", "An error occurred while saving the routine.");
        
      } finally {
        setSubmitting(false);
      }
  }

  const displayModal = (exerciseDetailId: any) => {
    const detail = exerciseDetails.find(detail => detail.exerciseDetailId === exerciseDetailId);
    console.log(detail);
    setModalContent(detail);
    setShowModal(true);
  };

//   const handleYoutubeVideo = (exerciseDetailId: any) => {
//     setDetailIdforVideo(exerciseDetailId);
//     setShowVideoModel(true)
//   }

  return (
   
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 2, justifyContent: "center" }}>
        <BackButton />
    { isLoading || isFetching ? (
         <View className="w-full flex justify-center items-center h-full my-4 px-4 mt-16">
         <Text className="text-xl text-center">Loading...</Text>
       </View>
    ) : (
        <>
        <View className="w-full flex justify-center items-center h-full my-4 px-4 mt-16">
          <Text className="text-3xl font-bold text-center">
            Daily Routine Detail
          </Text>

          <Text className="text-lg font-pregular text-left px-4 mt-4 mb-8">
            {dayName}
          </Text>
         
            <View className="w-full flex-row text-left" >    
                    <RefreshButton onRefresh={() => refreshExercise(0)} />
                    <Text className="pb-0 pt-1">
                        Swap an Exercise
                    </Text>
            </View>

            <View className="flex-row items-center rounded h-6" >
                <View className="flex-[6] flex-row mb-1 items-center rounded h-7" style={{ backgroundColor: "#0369a1" }}>
                        <Text className="flex-[3] text-center font-semibold text-white">
                            Exercise
                        </Text>
                        <Text className="flex-[1] text-center font-semibold text-white">
                            Sets
                        </Text>
                        <Text className="flex-[1] text-center font-semibold text-white">
                            Reps
                        </Text>
                </View>
                <View className="flex-[1]"></View>
            </View>

            {exerciseDetails.map((item) => (
                <View key={item.exerciseDetailId + 1} className="w-full py-1">
                    {/* Data row */}
                    <View className="flex-row items-center h-10">
                        <Text className="flex-[3] text-center">
                            {item.exerciseName}
                        </Text>
                        <Text className="flex-[1] text-center">
                            {item.sets}
                        </Text>
                        <Text className="flex-[1] text-center">
                            {item.reps}
                        </Text>
                        <View className="flex-[1]">    
                            <RefreshButton  onRefresh={() => refreshExercise(item.exerciseDetailId)} />
                        </View>
                    </View>
                </View>
                ))
            }

            <View className="w-full flex-row text-left mt-2" >    
                <VideoRefreshButton 
                    onRefresh={()=>{}}
                    style= {{
                        paddingTop: 2
                     }}
                     color= 'gray'
                />
                <Text className="ml-1 pb-2 pt-1">
                    Refresh a new video
                </Text>
            </View>

            {exerciseDetails.map((item, index) => (
                
                <View key={item.exerciseDetailId} className="w-full flex-row">
                    <View className="relative mr-2">
                        
                        <VideoRefreshButton 
                            onRefresh={() => refreshVideo(item.exerciseId)}
                            style={{
                                position: 'absolute',
                                top: 2, // Adjust this value to create enough space between icons
                                left: 52,
                                zIndex: 10,
                                borderRadious: 10
                            }} 
                        />
                        <TouchableOpacity onPress={() => {
                            setCurrentVideoId(item.youtubeURL.substring(item.youtubeURL.lastIndexOf('=') + 1));
                            setModalContent(item);
                            setShowVideoModel(true);
                        }}>
                            <Image 
                                source={{ uri: item.thumbnailURL }} 
                                className="w-[75] min-h-[95px] z-1 relative" 
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 border border-gray-300 items-center rounded-lg min-h-[95px]" style={{ backgroundColor: "#e5e5e5" }}>
                    
                        {/* Exercise Details header*/}
                        <View className="flex-row flex-[1] mb-1 items-center rounded h-7" style={{ backgroundColor: "#0369a1" }}>
                            <Text className="flex-[2] text-center font-semibold text-white">
                            Exercise
                            </Text>
                            <Text className="flex-[1] text-center font-semibold text-white">
                            Sets
                            </Text>
                            <Text className="flex-[1] text-center font-semibold text-white">
                            Reps
                            </Text>
                        </View>
                        <View className="flex-row flex-[3] items-center">
                            <Text className="flex-[2] text-center">
                                {item.exerciseName}
                            </Text>
                            <Text className="flex-[1] text-center">
                                {item.sets}
                            </Text>
                            <Text className="flex-[1] text-center">
                                {item.reps}
                            </Text>
                        </View>
                        <TouchableOpacity className="flex-[1]" onPress={() => displayModal(item.exerciseDetailId)}>
                                <Text style={{ color: '#0369a1' }} >See Exercise Detail</Text>
                        </TouchableOpacity>
                    </View>
                </View>      
            ))}
         
                        {isChanged && (
                            <View className="mt-2 items-center">
                                <CustomButton
                                title="Save"
                                handlePress={handleSaveRoutine}
                                containerStyles="w-52 bg-green-800"
                                isLoading={isSubmitting}
                                />
                            </View>
                        )}
                    

                <Modal
                    isVisible={showModal}
                    onBackdropPress={() => setShowModal(false)}
                    >
                <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                        {modalContent?.exerciseName}
                    </Text>
                    <Text className="text-lg font-pregular">
                        Required Equip: {modalContent?.requiredEquip.description}
                    </Text>
                    <Text className="text-lg font-pregular">
                        Sets: {modalContent?.sets}
                    </Text>
                    <Text className="text-lg font-pregular">
                        Reps: {modalContent?.reps}
                    </Text>
                    <Text className="text-lg font-pregular">
                        Level: {modalContent?.level.description}
                    </Text>
                    <Text className="text-lg font-pregular">
                        Env: {modalContent?.workoutEnvs.map(env => env.description).join(', ')}
                    </Text>
                    <Text className="text-lg font-pregular">
                        Part: {modalContent?.muscleGroups.map(muscle => muscle.description).join(', ')}
                    </Text>
                
                    <CustomButton
                        title="Close"
                        handlePress={() => setShowModal(false)}
                    />
                </View>
                </Modal>
                    <Modal
                        isVisible={showVideoModal}
                        onBackdropPress={() => setShowVideoModel(false)}
                        style={{
                            margin: 1,                  
                            justifyContent: 'center',    
                        }}
                    >
                    <View style={{ backgroundColor: "black", padding: 0, borderRadius: 10, width: '100%' }}>
                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setShowVideoModel(false)} 
                            style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                        >
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 2 }}>X</Text> 
                        </TouchableOpacity>

                        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 10, color: 'white' }}>
                            {modalContent?.exerciseName}
                        </Text>
                        
                        <YoutubePlayer
                            key={currentVideoId}
                            height={250}
                            play={true}
                            videoId={currentVideoId}
                        />
                    </View>
                </Modal>
            </View>
        </>)}
      </ScrollView>
    </SafeAreaView>
    
  );
};

export default dailyRoutineDetail;