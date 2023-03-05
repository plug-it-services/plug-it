// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'Plug.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Plug _$PlugFromJson(Map<String, dynamic> json) => Plug(
      id: json['id'] as String,
      name: json['name'] as String,
      icons: (json['icons'] as List<dynamic>).map((e) => e as String).toList(),
      enabled: json['enabled'] as bool,
    );

Map<String, dynamic> _$PlugToJson(Plug instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'icons': instance.icons,
      'enabled': instance.enabled,
    };
