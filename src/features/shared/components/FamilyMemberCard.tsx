import { IconSymbol } from '@/components/ui/icon-symbol';
import { FamilyMember } from '@/src/core/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileImage } from './ProfileImage';
import { BorderRadius, Colors, Spacing, Typography } from './theme';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onPress?: () => void;
}

// Get color based on relationship
const getRelationshipColor = (relationship: string): string => {
  const lowerRelation = relationship.toLowerCase();
  
  if (lowerRelation.includes('mother') || lowerRelation.includes('mom')) return Colors.pillPurple;
  if (lowerRelation.includes('father') || lowerRelation.includes('dad')) return Colors.pillBlue;
  if (lowerRelation.includes('sister')) return Colors.pillGreen;
  if (lowerRelation.includes('brother')) return Colors.pillOrange;
  if (lowerRelation.includes('son')) return Colors.pillBlue;
  if (lowerRelation.includes('daughter')) return Colors.pillPurple;
  if (lowerRelation.includes('grandma') || lowerRelation.includes('grandmother')) return Colors.pillPurple;
  if (lowerRelation.includes('grandpa') || lowerRelation.includes('grandfather')) return Colors.pillBlue;
  if (lowerRelation.includes('wife') || lowerRelation.includes('spouse')) return Colors.pillRed;
  if (lowerRelation.includes('husband') || lowerRelation.includes('spouse')) return Colors.pillRed;
  
  return Colors.primary; // Default color
};

// Get icon based on relationship
const getRelationshipIcon = (relationship: string): string => {
  const lowerRelation = relationship.toLowerCase();
  
  if (lowerRelation.includes('mother') || lowerRelation.includes('mom')) return 'heart';
  if (lowerRelation.includes('father') || lowerRelation.includes('dad')) return 'shield-halved';
  if (lowerRelation.includes('sister')) return 'star';
  if (lowerRelation.includes('brother')) return 'gamepad';
  if (lowerRelation.includes('son')) return 'child';
  if (lowerRelation.includes('daughter')) return 'child-dress';
  if (lowerRelation.includes('grandma') || lowerRelation.includes('grandmother')) return 'heart';
  if (lowerRelation.includes('grandpa') || lowerRelation.includes('grandfather')) return 'shield-halved';
  if (lowerRelation.includes('wife') || lowerRelation.includes('spouse')) return 'heart';
  if (lowerRelation.includes('husband') || lowerRelation.includes('spouse')) return 'heart';
  
  return 'user'; // Default icon
};

// Get medication badge color based on count
const getMedicationBadgeStyle = (count: number) => {
  if (count === 0) return { bg: '#F5F5F5', border: '#E0E0E0', color: Colors.textSecondary };
  if (count <= 2) return { bg: '#E8F5E9', border: '#A5D6A7', color: Colors.pillGreen };
  if (count <= 4) return { bg: '#FFF3E0', border: '#FFB74D', color: Colors.pillOrange };
  return { bg: '#FFEBEE', border: '#EF9A9A', color: Colors.pillRed };
};

export const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  onPress,
}) => {
  const accentColor = getRelationshipColor(member.relationship);
  const relationshipIcon = member.relationshipIcon || getRelationshipIcon(member.relationship);
  const medicationCount = member.medications?.length || 0;
  const medicationStyle = getMedicationBadgeStyle(medicationCount);
  
  return (
    <View style={styles.cardWrapper}>
      {/* Shadow box */}
      <View style={styles.shadowBox} />
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        {/* Left accent border */}
        <View style={[styles.leftAccent, { backgroundColor: accentColor }]} />
        
        {/* Profile Image with colored border */}
        <View style={styles.imageContainer}>
          <View style={[styles.imageBorder, { borderColor: accentColor }]}>
            <ProfileImage
              imageUri={member.profileImageUri}
              userName={member.name}
              size={48}
            />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text
              style={styles.name}
              numberOfLines={1}
            >
              {member.name}
            </Text>
          </View>
          
          <View style={styles.relationshipRow}>
            <View style={[styles.relationshipBadge, { backgroundColor: accentColor + '20' }]}>
              <IconSymbol
                name={relationshipIcon}
                library="FontAwesome6"
                size={10}
                color={accentColor}
              />
              <Text
                style={[styles.relationship, { color: accentColor }]}
                numberOfLines={1}
              >
                {member.relationship}
              </Text>
            </View>
          </View>
          
          {/* Medication count - always show */}
          <View style={[
            styles.medicationBadge,
            { 
              backgroundColor: medicationStyle.bg,
              borderColor: medicationStyle.border,
            }
          ]}>
            <IconSymbol
              name="pills"
              library="FontAwesome6"
              size={12}
              color={medicationStyle.color}
            />
            <View style={{ width: 4 }} />
            <Text style={[styles.medicationText, { color: medicationStyle.color }]}>
              {medicationCount} {medicationCount === 1 ? 'medication' : 'medications'}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={[styles.chevronContainer, { backgroundColor: accentColor + '15' }]}>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={accentColor}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  shadowBox: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: Colors.inputBorder,
    borderRadius: 5,
    zIndex: 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    minHeight: 90,
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  imageContainer: {
    marginRight: Spacing.md,
  },
  imageBorder: {
    borderRadius: BorderRadius.round,
    borderWidth: 3,
    padding: 2,
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...Typography.title,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    color: Colors.textPrimary,
  },
  relationshipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relationshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  relationship: {
    ...Typography.body,
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    fontWeight: '600',
  },
  medicationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  medicationText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
