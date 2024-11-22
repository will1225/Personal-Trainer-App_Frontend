import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/BackButton';
import * as generateRoutine from "../../controllers/generateRoutine";
import Modal from "react-native-modal";
import CustomButton from '@/components/CustomButton';
import VideoRefreshButton from '@/components/VideoRefreshButton';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Dropdown } from 'react-native-element-dropdown';
import { Text } from "@/components/Text"
import LoadingAnimation from '@/components/LoadingAnimation';
import { useColorScheme } from 'nativewind';

const ExerciseList = () => {
    const params = useLocalSearchParams();
    const muscleGroupId = params.id ? Number(params.id) : null;
    const description = params.description ? params.description : null;
    if (!muscleGroupId) throw "Missing Muscle Group Id";
    if (!description) throw "Missing Muscle Group Description"
    
    // State Variables
    const [workoutEnv, setWorkoutEnv] = useState<{ description: string; id: string }[]>([]);
    const [exercises, setExercises] = useState<any[]>([]);
    const [currentVideoId, setCurrentVideoId] = useState("");
    const [modalContent, setModalContent] = useState<any>();
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
    const [level, setLevel] = useState<{ description: string; id: string }[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [equipment, setEquipment] = useState<{ description: string; id: string }[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
    const [types, setType] = useState<{ description: string; id: string }[]>([]);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
    const [filtersActivated, setFiltersActivated] = useState(false);
    const { colorScheme } = useColorScheme();
    const headerColor = colorScheme === "dark" ? "#1B4A72" : "#0369a1";
    const blockColor = colorScheme === "dark" ? "#2A3442" : "#e5e5e5";
    const borderColor = colorScheme === "dark" ? "#4B5563" : "#D1D5DB";
    const detailLinkColor = colorScheme === "dark" ? "#25BCE7" : "#0369a1";

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {   
                // Fetch the muscle group exercises
                const fetchedExercises = await generateRoutine.fetchExercise(
                    undefined,            // exercise name
                    undefined,            // typeId
                    undefined,            // min intensity
                    undefined,            // max intensity
                    undefined,            // level id
                    undefined,            // requiredEquipmentId
                    undefined,            // workoutEnvironmentId
                    [muscleGroupId]       // muscleGroups[]
                );

                if (!fetchedExercises) throw `Cannot find exercises related to ${description}`;

                // Fetch video data for each fetched exercise
                const exercisesWithFetchedDetails = await Promise.all(
                    fetchedExercises.map(async (exercise: any) => {
                        try {
                            // Fetch video data by exerciseId 
                            const videoData = await generateRoutine.fetchVideoData(exercise.id);

                            // Fetch env data by exerciseId and flatten it
                            const envData = await generateRoutine.fetchExerciseDescByExerciseId(exercise.id);

                            return {
                                ...exercise,
                                env: envData.map((env: any) => ({ id: env.workoutEnvId, description: env.envDescription })),
                                type: { id: envData[0].typeId, description: envData[0].typeDescription},
                                equipment: { id: envData[0].equipmentId, description: envData[0].equipmentDescription },
                                level: { id: envData[0].levelId, description: envData[0].levelDescription },
                                videoUrl: videoData.data?.url,
                                thumbnailUrl: videoData.data?.thumbnail
                            };
                        } catch (videoError) {
                            console.error(`Failed to fetch video for exercise ${exercise.id}`, videoError);
                            return exercise; 
                        }
                    })
                );

                // Set all exercises state
                setExercises(exercisesWithFetchedDetails);

                // Make a unique flat list as key-value pairs from the fetched exercises for dropdowns
                const deselectOption = {id: null, description: "Deselect"};
                const workoutEnvs = [deselectOption, ...new Map(exercisesWithFetchedDetails.flatMap((ex) => ex.env).map((env) => [env.id, env])).values()];
                const levels = [deselectOption, ...new Map(exercisesWithFetchedDetails.map((ex) => [ex.levelId, ex.level])).values()];
                const equipment = [deselectOption, ...new Map(exercisesWithFetchedDetails.map((ex) => [ex.requiredEquipmentId, ex.equipment])).values()];
                const types = [deselectOption, ...new Map(exercisesWithFetchedDetails.map((ex) => [ex.typeId, ex.type])).values()];

                // Set dropdown state
                setWorkoutEnv(workoutEnvs);
                setLevel(levels);
                setEquipment(equipment);
                setType(types);

            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setIsLoading(false);
            }
        };  
        fetchData();
    }, []);

    // Listen to the filters
    useEffect(() => {

        // Get filtered exercises
        const newFilteredExercises = filterExercises();
        setFilteredExercises(newFilteredExercises);

        // Set filter state
        const activatedFilters = !!selectedEnv || !!selectedLevel || !!selectedEquipment || !!selectedType; // explicit way to convert to boolean
        setFiltersActivated(activatedFilters);

    }, [selectedEnv, selectedLevel, selectedEquipment, selectedType, exercises]);
    
    // Helper to filter exercises based on the selected criteria
    const filterExercises = () => {
        return exercises.filter((exercise) => {
            const matchesEnv = selectedEnv ? exercise.env.some((env: { id: string; }) => env.id === selectedEnv) : true;
            const matchesLevel = selectedLevel ? exercise.level.id === selectedLevel : true;
            const matchesEquipment = selectedEquipment ? exercise.equipment.id === selectedEquipment : true;
            const matchesType = selectedType ? exercise.type.id === selectedType : true;
    
            return matchesEnv && matchesLevel && matchesEquipment && matchesType;
        });
    };
    
    // Helper to set selected Exercise Details Modal
    const displayModal = (exercise: any) => {
        setModalContent(exercise);
        setShowModal(true);
    };

    // Help to refresh the selected Exercise video
    const refreshVideo = async (exercise: any) => {
        try {
            // Fetch a new random vid
            const videoData = await generateRoutine.fetchVideoData(exercise.id);

            if (!videoData || videoData.length === 0) {
                console.log("No video data found for this exercise");
                return;
            }
        
            // Shallow copy the exercise and update the video and thumbnail urls
            const updatedExercise = {
                ...exercise,
                videoUrl: videoData.data.url,
                thumbnailUrl: videoData.data.thumbnail,
            };

            // Find the requested exerciseId to update its state so that the UI re-renders
            setExercises((existingExercises) =>
                existingExercises.map((existingExercise) =>
                    existingExercise.id === exercise.id ? updatedExercise : existingExercise
                )
            );
        } catch (err) {
            console.log("Failed to refresh video", err);
        }        
    };

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ flexGrow: 2, justifyContent: "center" }}>        
                <View className="w-full h-full flex justify-center items-center my-4 px-4 mt-28">
                    <BackButton />

                    {/* Muscle Group header */}
                    <Text className="text-3xl font-bold text-center mb-12">
                        {description}
                    </Text>
                    
                    <View className="flex-row w-full mb-5">

                        {/* Difficulty Dropdown */}
                        <View className="flex-[1] mr-2">
                            <Text className="font-psemibold text-base mb-1">Difficulty</Text>
                            <Dropdown
                                style={{
                                height: 48,
                                borderWidth: 2,
                                borderColor: "black",
                                backgroundColor: "white",
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                }}
                                placeholderStyle={{ fontSize: 16, color: "gray" }}
                                selectedTextStyle={{ fontSize: 16 }}
                                data={level}
                                labelField="description"
                                valueField="id"
                                placeholder={"Select Difficulty"}
                                value={selectedLevel}
                                onChange={(item) => { setSelectedLevel(item.id) }}
                                renderItem={(item) => (
                                    <View style={{ padding: 16, borderRadius: 16 }}>
                                        <Text style={{ color: item.id === null ? 'gray' : 'black', fontSize: 16 }}>
                                            {item.description}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>

                        {/* Environment Dropdown */}
                        <View className="flex-[1]">
                            <Text className="font-psemibold text-base mb-1">Environment</Text>
                            <Dropdown
                                style={{
                                height: 48,
                                borderWidth: 2,
                                borderColor: "black",
                                backgroundColor: "white",
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                }}
                                placeholderStyle={{ fontSize: 16, color: "gray" }}
                                selectedTextStyle={{ fontSize: 16 }}
                                data={workoutEnv}
                                labelField="description"
                                valueField="id"
                                placeholder={"Select Workout Environment"}
                                value={selectedEnv}
                                onChange={(item) => { setSelectedEnv(item.id) }}
                                renderItem={(item) => (
                                    <View style={{ padding: 16, borderRadius: 16 }}>
                                        <Text style={{ color: item.id === null ? 'gray' : 'black', fontSize: 16 }}>
                                            {item.description}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                    
                    <View className="flex-row w-full mb-5">
                        
                        {/* Equipment Dropdown */}
                        <View className="flex-[1] mr-2">
                            <Text className="font-psemibold text-base mb-1">Equipment</Text>
                            <Dropdown
                                style={{
                                height: 48,
                                borderWidth: 2,
                                borderColor: "black",
                                backgroundColor: "white",
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                }}
                                placeholderStyle={{ fontSize: 16, color: "gray" }}
                                selectedTextStyle={{ fontSize: 16 }}
                                data={equipment}
                                labelField="description"
                                valueField="id"
                                placeholder={"Select Equipment"}
                                value={selectedEquipment}
                                onChange={(item) => { setSelectedEquipment(item.id) }}
                                renderItem={(item) => (
                                    <View style={{ padding: 16, borderRadius: 16 }}>
                                        <Text style={{ color: item.id === null ? 'gray' : 'black', fontSize: 16 }}>
                                            {item.description}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>

                        {/* Type Dropdown */}
                        <View className="flex-[1]">
                            <Text className="font-psemibold text-base mb-1">Type</Text>
                            <Dropdown
                                style={{
                                height: 48,
                                borderWidth: 2,
                                borderColor: "black",
                                backgroundColor: "white",
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                }}
                                placeholderStyle={{ fontSize: 16, color: "gray" }}
                                selectedTextStyle={{ fontSize: 16 }}
                                data={types}
                                labelField="description"
                                valueField="id"
                                placeholder={"Select Type"}
                                value={selectedType}
                                onChange={(item) => { setSelectedType(item.id) }}
                                renderItem={(item) => (
                                    <View style={{ padding: 16, borderRadius: 16 }}>
                                        <Text style={{ color: item.id === null ? 'gray' : 'black', fontSize: 16 }}>
                                            {item.description}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>
                    </View>

                    {/* Reset filters button */}
                    <View className="flex-row justify-end w-full mt-2 mr-4">
                        <TouchableOpacity className="" onPress={() => {
                            setSelectedEnv(null);
                            setSelectedLevel(null);
                            setSelectedEquipment(null);
                            setSelectedType(null);
                            setFiltersActivated(false);
                        }}>
                            <Text className="font-psemibold text-base">
                                Reset Filters
                            </Text>
                        </TouchableOpacity>
                    </View>                    

                    {/* Loading indicator */}
                    {isLoading && (
                        <LoadingAnimation isLoading={isLoading} />
                    )}

                    {/* Refresh a new video header */}
                    {!isLoading && exercises && filteredExercises.length > 0 && (
                        <View className="w-full flex-row text-left mt-4" >    
                            <VideoRefreshButton onRefresh={()=>{}} style= {{ paddingTop: 2 }} color= 'gray'/>
                            <Text className="ml-1 pb-2 pt-1">
                                Refresh a new video
                            </Text>
                        </View>
                    )}

                    {/* Exercise parent blocks */}
                    {!isLoading && exercises && (
                        filtersActivated && filteredExercises.length === 0 ? (
                            <Text className="font-psemibold text-base mt-20">No exercises match the selected filters.</Text>
                        ) : (
                            (filtersActivated ? filteredExercises : exercises).map((exercise, index) => (
                                <View key={index} className="flex-row mb-1 items-center">                                
                                    <View className='relative'>

                                        {/* YouTube thumbnail and playback handler */}
                                        <TouchableOpacity onPress={() => {
                                            setCurrentVideoId(exercise.videoUrl.substring(exercise.videoUrl.lastIndexOf('=') + 1));
                                            setModalContent(exercise);
                                            setShowVideoModal(true);
                                        }}>
                                            {/* YouTube Thumbnail */}
                                            <Image source={{ uri: exercise.thumbnailUrl}} className="w-[80] h-[80] mr-2" resizeMode="cover" />
                                        </TouchableOpacity>

                                        {/* Video refresh button */}
                                        <VideoRefreshButton 
                                            onRefresh={() => refreshVideo(exercise)}
                                            style={{
                                                position: 'absolute',
                                                top: 5, 
                                                left: 59,
                                                zIndex: 10,
                                                borderRadious: 10
                                            }} 
                                        />
                                    </View>
                                    
                                    {/* Exercise info blocks */}
                                    <View 
                                        className="flex-1 border items-center rounded-lg min-h-[65px]" 
                                        style={{ 
                                            backgroundColor: blockColor,
                                            borderColor: borderColor
                                        }}
                                    >
                                        
                                        {/* Exercise Header */}
                                        <View 
                                            className="flex-row mb-1 items-center h-7" 
                                            style={{
                                                backgroundColor: headerColor,
                                                borderTopLeftRadius: 8,
                                                borderTopRightRadius: 8,
                                              }}
                                        >
                                            <Text className="flex-[2] text-center font-semibold text-white">
                                                Exercise
                                            </Text>
                                            <Text className="flex-[1] text-center font-semibold text-white">
                                                Sets
                                            </Text>
                                            <Text className="flex-[1] text-center font-semibold text-white">
                                                {exercise.defaultReps ? "Reps" : "Mins"}
                                            </Text>
                                        </View>

                                        {/* Data Row */}
                                        <View className="flex-row items-center">
                                            <Text className="flex-[2] text-center">
                                                {exercise.name}
                                            </Text>
                                            <Text className="flex-[1] text-center">
                                                {exercise.defaultSets}
                                            </Text>
                                            <Text className="flex-[1] text-center">
                                                {exercise.defaultReps ? exercise.defaultReps : exercise.minutes}
                                            </Text>
                                        </View>

                                        {/* Exercise Details Modal button */}
                                        <TouchableOpacity className="flex-[1] mt-3" onPress={() => displayModal(exercise)}>
                                            <Text style={{ color: detailLinkColor }} >See Exercise Detail</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )
                    )}
                </View>

                {/* Exercise Details Modal */}
                {showModal && modalContent && (
                    <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
                        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, color: '#333' }}>
                                {modalContent.name}
                            </Text>
                            
                            <Text className="text-lg font-pregular" style={{ color: '#333' }}>
                                Muscle Group: {description}{'\n'}
                                Type: {modalContent.type.description}{'\n'}
                                Level: {modalContent.level.description}{'\n'}
                                Equipment: {modalContent.equipment.description}{'\n'}
                                Environment: {modalContent.env.map((e: any) => e.description).join(', ')}{'\n'}                                
                                Default Sets: {modalContent.defaultSets}{'\n'}
                                {modalContent.defaultReps ? `Default Reps: ${modalContent.defaultReps}${'\n'}` : `Default Minutes: ${modalContent.minutes}${'\n'}`}            
                            </Text>
                            
                            <CustomButton title="Close" handlePress={() => setShowModal(false)}/>
                        </View>
                    </Modal>
                )}

                {/* Video Modal */}
                <Modal
                    isVisible={showVideoModal}
                    onBackdropPress={() => setShowVideoModal(false)}
                    style={{ margin: 1, justifyContent: 'center' }}
                >
                    <View style={{ backgroundColor: "black", padding: 0, borderRadius: 10, width: '100%' }}>
                        <TouchableOpacity
                            onPress={() => setShowVideoModal(false)} 
                            style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                        >
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 2 }}>X</Text> 
                        </TouchableOpacity>

                        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 10, color: 'white' }}>
                            {modalContent?.name}
                        </Text>
                        
                        <YoutubePlayer
                            key={currentVideoId}
                            height={250}
                            play={true}
                            videoId={currentVideoId}
                        />
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ExerciseList