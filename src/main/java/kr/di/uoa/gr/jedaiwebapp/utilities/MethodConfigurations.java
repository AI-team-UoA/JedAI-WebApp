package kr.di.uoa.gr.jedaiwebapp.utilities;

import org.scify.jedai.schemaclustering.AttributeValueClustering;
import org.scify.jedai.schemaclustering.HolisticAttributeClustering;
import org.scify.jedai.schemaclustering.ISchemaClustering;
import org.scify.jedai.utilities.enumerations.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.blockprocessing.blockcleaning.BlockFiltering;
import org.scify.jedai.blockprocessing.blockcleaning.ComparisonsBasedBlockPurging;
import org.scify.jedai.blockprocessing.blockcleaning.SizeBasedBlockPurging;
import org.scify.jedai.blockprocessing.comparisoncleaning.CanopyClustering;
import org.scify.jedai.blockprocessing.comparisoncleaning.CardinalityEdgePruning;
import org.scify.jedai.blockprocessing.comparisoncleaning.CardinalityNodePruning;
import org.scify.jedai.blockprocessing.comparisoncleaning.ComparisonPropagation;
import org.scify.jedai.blockprocessing.comparisoncleaning.ExtendedCanopyClustering;
import org.scify.jedai.blockprocessing.comparisoncleaning.ReciprocalCardinalityNodePruning;
import org.scify.jedai.blockprocessing.comparisoncleaning.ReciprocalWeightedNodePruning;
import org.scify.jedai.blockprocessing.comparisoncleaning.WeightedEdgePruning;
import org.scify.jedai.blockprocessing.comparisoncleaning.WeightedNodePruning;
import org.scify.jedai.entityclustering.CenterClustering;
import org.scify.jedai.entityclustering.ConnectedComponentsClustering;
import org.scify.jedai.entityclustering.CutClustering;
import org.scify.jedai.entityclustering.IEntityClustering;
import org.scify.jedai.entityclustering.MarkovClustering;
import org.scify.jedai.entityclustering.MergeCenterClustering;
import org.scify.jedai.entityclustering.RicochetSRClustering;
import org.scify.jedai.entityclustering.UniqueMappingClustering;
import org.scify.jedai.schemaclustering.AttributeNameClustering;



public class MethodConfigurations {
	
	public static final Map<String, BlockBuildingMethod> blockBuildingMethods = createMap();
	
	
	
	/**
     * Return map of block building methods' String names to their enumeration values
     *
     * @return Mapping of block building method names to enum values
     */
    private static Map<String, BlockBuildingMethod> createMap() {
        Map<String, BlockBuildingMethod> result = new HashMap<>();
        result.put(JedaiOptions.STANDARD_TOKEN_BUILDING, BlockBuildingMethod.STANDARD_BLOCKING);
        result.put(JedaiOptions.SORTED_NEIGHBORHOOD, BlockBuildingMethod.SORTED_NEIGHBORHOOD);
        result.put(JedaiOptions.SORTED_NEIGHBORHOOD_EXTENDED, BlockBuildingMethod.EXTENDED_SORTED_NEIGHBORHOOD);
        result.put(JedaiOptions.Q_GRAMS_BLOCKING, BlockBuildingMethod.Q_GRAMS_BLOCKING);
        result.put(JedaiOptions.Q_GRAMS_BLOCKING_EXTENDED, BlockBuildingMethod.EXTENDED_Q_GRAMS_BLOCKING);
        result.put(JedaiOptions.SUFFIX_ARRAYS_BLOCKING, BlockBuildingMethod.SUFFIX_ARRAYS);
        result.put(JedaiOptions.SUFFIX_ARRAYS_BLOCKING_EXTENDED, BlockBuildingMethod.EXTENDED_SUFFIX_ARRAYS);
        result.put(JedaiOptions.LSH_SUPERBIT_BLOCKING, BlockBuildingMethod.LSH_SUPERBIT_BLOCKING);
        result.put(JedaiOptions.LSH_MINHASH_BLOCKING, BlockBuildingMethod.LSH_MINHASH_BLOCKING);
        return Collections.unmodifiableMap(result);
    }
    
    
    
	public static ISchemaClustering getSchemaClusteringMethodByName(String methodName) {
        ISchemaClustering schemaClustering = null;

        switch (methodName) {
            case JedaiOptions.ATTRIBUTE_NAME_CLUSTERING:
                schemaClustering = new AttributeNameClustering(
                        RepresentationModel.CHARACTER_TRIGRAMS, SimilarityMetric.ENHANCED_JACCARD_SIMILARITY);
                break;
            case JedaiOptions.ATTRIBUTE_VALUE_CLUSTERING:
                schemaClustering = new AttributeValueClustering(
                        RepresentationModel.CHARACTER_TRIGRAMS, SimilarityMetric.ENHANCED_JACCARD_SIMILARITY);
                break;
            case JedaiOptions.HOLISTIC_ATTRIBUTE_CLUSTERING: 
                schemaClustering = new HolisticAttributeClustering(
                        RepresentationModel.CHARACTER_TRIGRAMS, SimilarityMetric.ENHANCED_JACCARD_SIMILARITY);
                break;
            default:
            	System.out.println("ERROR: Schema clustering method does not exist: " + methodName);
        }

        return schemaClustering;
    }
	
	
	public static IEntityClustering getEntityClusteringMethod(String methodName) {
        IEntityClustering method;

        switch (methodName) {
            case JedaiOptions.CENTER_CLUSTERING:
                method = new CenterClustering();
                break;
            case JedaiOptions.CONNECTED_COMPONENTS_CLUSTERING:
                method = new ConnectedComponentsClustering();
                break;
            case JedaiOptions.CUT_CLUSTERING:
                method = new CutClustering();
                break;
            case JedaiOptions.MARKOV_CLUSTERING:
                method = new MarkovClustering();
                break;
            case JedaiOptions.MERGE_CENTER_CLUSTERING:
                method = new MergeCenterClustering();
                break;
            case JedaiOptions.RICOCHET_SR_CLUSTERING:
                method = new RicochetSRClustering();
                break;
            case JedaiOptions.UNIQUE_MAPPING_CLUSTERING:
                method = new UniqueMappingClustering();
                break;
            default:
            	System.out.println("ERROR: Entity clustering method does not exist: " + methodName);
                method = null;
        }

        return method;
    }
	
	
    
	
	
	
	public static IBlockProcessing getMethodByName(String method) {
        IBlockProcessing processingMethod = null;

        // Get appropriate processing method
        switch (method) {
            // Block Building methods
            case JedaiOptions.BLOCK_FILTERING:
                processingMethod = new BlockFiltering();
                break;
            case JedaiOptions.SIZE_BASED_BLOCK_PURGING:
                processingMethod = new SizeBasedBlockPurging();
                break;
            case JedaiOptions.COMPARISON_BASED_BLOCK_PURGING:
                processingMethod = new ComparisonsBasedBlockPurging();
                break;
            // Below: Comparison Cleaning methods
            case JedaiOptions.COMPARISON_PROPAGATION:
                processingMethod = new ComparisonPropagation();
                break;
            case JedaiOptions.CARDINALITY_EDGE_PRUNING:
                processingMethod = new CardinalityEdgePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.CARDINALITY_NODE_PRUNING:
                processingMethod = new CardinalityNodePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.WEIGHED_EDGE_PRUNING:
                processingMethod = new WeightedEdgePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.WEIGHED_NODE_PRUNING:
                processingMethod = new WeightedNodePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.RECIPROCAL_CARDINALITY_NODE_PRUNING:
                processingMethod = new ReciprocalCardinalityNodePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.RECIPROCAL_WEIGHED_NODE_PRUNING:
                processingMethod = new ReciprocalWeightedNodePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.CANOPY_CLUSTERING:
                processingMethod = new CanopyClustering();
                break;
            case JedaiOptions.CANOPY_CLUSTERING_EXTENDED:
                processingMethod = new ExtendedCanopyClustering();
                break;
            default:
            	System.out.println("ERROR: getMethodByName method does not exist: " + method);
        }

        // Return the method
        return processingMethod;
    }

}
