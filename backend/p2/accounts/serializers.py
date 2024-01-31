from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']
        read_only_fields = ('id',)




class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True, many=False)
    avatarURL = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'user', 'avatar', 'avatarURL', 'phone_number']
        read_only_fields = ('id',)

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(username=user_data['username'],
                                   first_name=user_data['first_name'],
                                   last_name=user_data['last_name'],
                                   email=user_data['email']
                                   )

        user.set_password(user_data['password'])
        user.save()

        avatar = validated_data['avatar'] if 'avatar' in validated_data else None

        profile = Profile.objects.create(user=user,
                                         avatar=avatar,
                                         phone_number=validated_data['phone_number']
                                         )

        profile.save()
        return profile

    def update(self, instance, validated_data):
        logged_in_user = self.context['request'].user
        user_to_update = instance.user

        if logged_in_user.id != user_to_update.id:
            raise serializers.ValidationError({"authorize": "You do not have permission to update this user."})

        # update user instance
        user_data = validated_data.pop('user')
        user_to_update.first_name = user_data['first_name']
        user_to_update.last_name = user_data['last_name']
        user_to_update.email = user_data['email']
        user_to_update.save()

        cur_avatar = Profile.objects.get(user=instance.user).avatar
        avatar = cur_avatar

        if 'avatar' in validated_data:
            avatar = validated_data['avatar']
        
        # update profile instance
        if avatar != cur_avatar:
            instance.avatar = avatar
        instance.phone_number = validated_data['phone_number']
        instance.save()

        return instance
    
    def get_avatarURL(self, obj):
        if obj.avatar:
            return "http://localhost:8000" + obj.avatar.url
        else:
            return

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        data.update({'id': self.user.id})
        return data
