// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'Service.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Service _$ServiceFromJson(Map<String, dynamic> json) => Service(
      name: json['name'] as String,
      authType: json['authType'] as String,
      icon: json['icon'] as String,
      connected: json['connected'] as bool,
    );

Map<String, dynamic> _$ServiceToJson(Service instance) => <String, dynamic>{
      'name': instance.name,
      'authType': instance.authType,
      'icon': instance.icon,
      'connected': instance.connected,
    };
